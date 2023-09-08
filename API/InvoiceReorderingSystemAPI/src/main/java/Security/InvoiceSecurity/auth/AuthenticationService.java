package Security.InvoiceSecurity.auth;

import Security.InvoiceSecurity.config.JwtService;
import Security.InvoiceSecurity.models.SpecialInvoiceAuthenticationResponse;
import Security.InvoiceSecurity.user.Role;
import Security.InvoiceSecurity.user.User;
import Security.InvoiceSecurity.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private final UserRepository repository;


    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        if (repository.existsByUsername(request.getUsername())) {
            // Handle the case where the user already exists
            return AuthenticationResponse.builder()
                    .token("Username already exists")
                    .build();
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();

    }

    public LoginResponse authenticate(AuthenticationRequest request) {
       try {
           authenticationManager.authenticate(
                   new UsernamePasswordAuthenticationToken(
                           request.getUsername(),
                           request.getPassword()

                   )
           );
           var user = repository.findByUsername(request.getUsername())
                   .orElseThrow();

           var jwtToken = jwtService.generateToken(user);
           AuthenticationResponse authResponse = AuthenticationResponse.builder()
                   .token(jwtToken)
                   .role(user.getRole())// Assuming the 'getRole()' method exists in the User class
                   .userName(user.getUsername())
                   .build();
           return LoginResponse.builder()
                   .statusCode("200")
                   .message("SUCCESS")
                   .authenticationResponse(authResponse)
                   .build();
       }catch (AuthenticationException e){
           return LoginResponse.builder()
                   .statusCode("400")
                   .message("ERROR")
                   .build();
       }
    }


}
