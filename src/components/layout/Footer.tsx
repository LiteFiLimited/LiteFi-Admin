"use client";

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-4 px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} LiteFi. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">
            Terms
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">
            Privacy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
} 