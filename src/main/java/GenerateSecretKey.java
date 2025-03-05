import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Base64;

public class GenerateSecretKey {
    public static void main(String[] args) {
        // ✅ 256비트(32바이트) 이상 길이의 시크릿 키 생성
        String secretKey = Base64.getEncoder()
                .encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());

        System.out.println("Generated SECRET_KEY: " + secretKey);
    }
}