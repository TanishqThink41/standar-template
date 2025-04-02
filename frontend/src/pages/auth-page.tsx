import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@/services/schema/schema";
import { z } from "zod";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import loginImage from "../assets/login-image.jpg";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-[800px] shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex">
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Welcome to Agentix41</h1>
                <p className="text-gray-500 text-sm">Powering Conversations with Think41</p>
              </div>
              
              {!showRegister ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-3 mb-4 py-2.5 border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </Button>
                  
                  <div className="flex items-center my-5">
                    <div className="flex-grow h-px bg-gray-200"></div>
                    <span className="px-3 text-xs text-gray-500">Or continue with email</span>
                    <div className="flex-grow h-px bg-gray-200"></div>
                  </div>
                  
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="username"
                          placeholder="Enter your email"
                          className="h-11 text-sm"
                          {...loginForm.register("username")}
                        />
                        {loginForm.formState.errors.username && (
                          <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="h-11 text-sm"
                          {...loginForm.register("password")}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <Label htmlFor="remember" className="text-xs text-gray-600">Remember Me</Label>
                        </div>
                        <Button variant="link" className="p-0 h-auto text-xs text-blue-600">
                          Forgot Password?
                        </Button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-sm"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Sign in
                      </Button>
                      
                      <div className="text-center text-xs mt-2 text-gray-600">
                        Don't have an account?{" "}
                        <button 
                          type="button"
                          onClick={() => setShowRegister(true)}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Sign Up now
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="reg-username" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="reg-username"
                        placeholder="Enter your email"
                        className="h-9 text-sm"
                        {...registerForm.register("username")}
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        className="h-9 text-sm"
                        {...registerForm.register("password")}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="reg-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <Input
                        id="reg-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="h-9 text-sm"
                        {...registerForm.register("confirmPassword")}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-sm"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Sign Up
                    </Button>
                    
                    <div className="text-center text-xs mt-4 text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setShowRegister(false)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            <div className="hidden md:flex md:w-1/2 items-center justify-center">
              <img
                src={loginImage}
                className="w-full max-w-[220px] h-auto"
                alt="Login illustration"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}