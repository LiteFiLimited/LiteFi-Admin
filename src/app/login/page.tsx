import React from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center">
          <Image 
            src="/assets/litefi.svg" 
            alt="LiteFi Admin"
            width={100}
            height={30}
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
} 