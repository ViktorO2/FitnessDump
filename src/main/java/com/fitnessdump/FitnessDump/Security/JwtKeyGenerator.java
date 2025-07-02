package com.fitnessdump.FitnessDump.Security;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.SecretKey;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // Генериране на безопасен ключ с размер 256 бита
        SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

        // Извеждаме байтовете на ключа за проверка
        System.out.println("Secret Key: " + new String(secretKey.getEncoded()));
    }
}
