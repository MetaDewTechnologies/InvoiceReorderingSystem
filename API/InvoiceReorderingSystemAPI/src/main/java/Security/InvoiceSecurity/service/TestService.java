package Security.InvoiceSecurity.service;

import Security.InvoiceSecurity.auth.AuthenticationRequest;
import Security.InvoiceSecurity.models.SpecialInvoiceAuthenticationResponse;
import Security.InvoiceSecurity.user.User;
import Security.InvoiceSecurity.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    public SpecialInvoiceAuthenticationResponse specialAuthenticate(AuthenticationRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        // Find the user by username
        Optional<User> optionalUser = repository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Verify the password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return SpecialInvoiceAuthenticationResponse.builder()
                        .successCode("SUCCESS")
                        .role(user.getRole())
                        .build();
            }
        }

        return SpecialInvoiceAuthenticationResponse.builder()
                .successCode("ERROR")
                .build();
    }
}
