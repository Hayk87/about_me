import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class SpeakeasyService {
  generateSecretObject(name: string) {
    return speakeasy.generateSecret({ name });
  }

  generateQrCodeImage(otpauth_url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!otpauth_url) return resolve('');
      qrcode.toDataURL(otpauth_url, function (err, data_url) {
        if (err) {
          return reject(err);
        }
        resolve(data_url);
      });
    });
  }

  verify2FA(base32: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret: base32,
      encoding: 'base32',
      token,
    });
  }
}
