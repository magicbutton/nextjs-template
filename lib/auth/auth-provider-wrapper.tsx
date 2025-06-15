'use client';

import React, { Suspense } from 'react';
import { AuthProvider } from './auth-context';

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>
  );
}