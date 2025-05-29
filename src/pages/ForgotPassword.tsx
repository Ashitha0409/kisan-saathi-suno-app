
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sun, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call for password reset
    setTimeout(() => {
      console.log('Password reset requested for:', email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Resending password reset email to:', email);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
              <Sun className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Kisan Saathi</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
            </CardTitle>
            <p className="text-gray-600">
              {isSubmitted 
                ? 'We\'ve sent a password reset link to your email address.'
                : 'Enter your email address and we\'ll send you a link to reset your password.'
              }
            </p>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-medium text-gray-800">{email}</p>
                  <p className="text-sm text-gray-600">
                    Please check your email and click the link to reset your password.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Didn't receive the email?
                  </p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full text-green-600 border-green-600 hover:bg-green-50"
                  >
                    {isLoading ? 'Resending...' : 'Resend Email'}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Still having trouble?</p>
          <Link 
            to="/contact" 
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
