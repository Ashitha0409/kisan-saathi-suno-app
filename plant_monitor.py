import streamlit as st
import serial
import serial.tools.list_ports
import pandas as pd
import numpy as np
from datetime import datetime

# Initialize session state
if 'data' not in st.session_state:
    st.session_state.data = pd.DataFrame({
        'Time': [],
        'Height (cm)': []
    })

# Page config
st.set_page_config(page_title='Plant Height Monitor', layout='wide')

# Title
st.title('Plant Height Monitor')

# Sidebar
st.sidebar.title('Controls')

# Get available ports
ports = [port.device for port in serial.tools.list_ports.comports()]
if not ports:
    st.sidebar.error('No COM ports found!')
    st.stop()

# COM port selection
selected_port = st.sidebar.selectbox(
    'Select COM Port',
    ports,
    index=ports.index('COM10') if 'COM10' in ports else 0
)

# Connect button
if st.sidebar.button('Start Monitoring'):
    try:
        # Close existing connection
        if 'ser' in st.session_state:
            st.session_state.ser.close()
        
        # Connect to selected port
        st.session_state.ser = serial.Serial(selected_port, 9600)
        st.sidebar.success(f'Connected to {selected_port}')
        
    except Exception as e:
        st.sidebar.error(f'Error: {e}')

# Reset button
if st.sidebar.button('Reset Servos'):
    if 'ser' in st.session_state:
        st.session_state.ser.write(b'RESET\n')
        st.sidebar.success('Reset command sent!')
    else:
        st.sidebar.error('Not connected to device')

# Main display area
if 'ser' not in st.session_state:
    st.info('Please select a COM port and click Start Monitoring')
    st.stop()

# Create placeholders
chart = st.empty()
stats = st.empty()

# Main loop
while 'ser' in st.session_state:
    if st.session_state.ser.in_waiting:
        try:
            # Read and parse height value
            line = st.session_state.ser.readline().decode().strip()
            value = float(line.split('Height:')[1].split('cm')[0])
            
            # Create new row
            new_row = pd.DataFrame({
                'Time': [datetime.now().strftime('%H:%M:%S')],
                'Height (cm)': [value]
            })
            
            # Update data
            st.session_state.data = pd.concat(
                [new_row, st.session_state.data]
            ).iloc[:60]  # Keep last 60 rows
            
            # Convert height to numeric
            heights = pd.to_numeric(st.session_state.data['Height (cm)'])
            
            # Update chart
            chart.line_chart(
                data=st.session_state.data.set_index('Time')['Height (cm)'],
                height=400
            )
            
            # Calculate stats
            current = value
            avg = heights.mean()
            maximum = heights.max()
            minimum = heights.min()
            
            # Show stats
            stats.columns([
                f"Current: {current:.1f} cm",
                f"Average: {avg:.1f} cm",
                f"Maximum: {maximum:.1f} cm",
                f"Minimum: {minimum:.1f} cm"
            ])
            
        except Exception as e:
            st.error(f'Error: {e}')
