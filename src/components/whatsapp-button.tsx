import Link from 'next/link';
import type { SVGProps } from 'react';
import { Button } from '@/components/ui/button';

const WhatsAppBrandIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        {...props}
    >
        <path d="m16 2a14 14 0 0 0 -14 14a14 14 0 0 0 14 14a14 14 0 0 0 14 -14a14 14 0 0 0 -14 -14zm0 26a12 12 0 0 1 -12 -12a12 12 0 0 1 12 -12a12 12 0 0 1 12 12a12 12 0 0 1 -12 12zm0 0" />
        <path d="m22.1 18.5c-.3-.2-1.8-1-2-1.1c-.3-.1-.5-.1-.7.2c-.2.2-.8.9-1 1.1s-.4.2-.7.1c-.3-.1-1.3-.5-2.5-1.5c-1-.7-1.6-1.6-1.8-1.9c-.2-.3 0-.5.1-.6s.2-.3.4-.4c.1-.1.2-.3.3-.4c.1-.2 0-.4-.1-.5c-.1-.1-.7-1.6-1-2.2c-.2-.6-.5-.5-.7-.5h-.5c-.2 0-.5.1-.7.3c-.2.2-.8 1-.8 2.3s.8 2.7 1 2.8c.1.2 1.8 2.9 4.4 3.9c.6.2 1.1.4 1.5.5c.6.2 1.1.1 1.5-.1c.5-.3 1.5-1.1 1.7-1.5c.2-.4.2-.7.1-.8l-.4-.1z" />
    </svg>
);

interface WhatsAppButtonProps {
  phoneNumber?: string;
  show?: boolean;
}

export function WhatsAppButton({ phoneNumber = "0000000000", show = true }: WhatsAppButtonProps) {
  if (!show) return null;

  return (
    <Button
      asChild
      className="mt-8 bg-whatsapp-green text-primary-foreground font-bold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-whatsapp-green/90 hover:shadow-lg hover:shadow-whatsapp-green/20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500"
      size="lg"
    >
      <Link href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
        <WhatsAppBrandIcon className="mr-3 h-6 w-6" />
        Happy to chat on WhatsApp
      </Link>
    </Button>
  );
}
