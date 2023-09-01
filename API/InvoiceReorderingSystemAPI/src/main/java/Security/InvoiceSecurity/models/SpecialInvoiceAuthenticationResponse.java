package Security.InvoiceSecurity.models;

import Security.InvoiceSecurity.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpecialInvoiceAuthenticationResponse {
    private String successCode;
    private Role role;
}
