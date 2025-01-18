import crypto from 'node:crypto';

import { envs } from '@infrastructure/config/envs';

interface SignaturePayload {
  amount: number;
  currency: string;
  reference: string;
}

export async function generateSignature({
  amount,
  currency,
  reference,
}: SignaturePayload): Promise<string> {
  const st = `${reference}${amount}${currency}${envs.PAYMENT_API_SIGNATURE}`;
  const encondedText = new TextEncoder().encode(st);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
