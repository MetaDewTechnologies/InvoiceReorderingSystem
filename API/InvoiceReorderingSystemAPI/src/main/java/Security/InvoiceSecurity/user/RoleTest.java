package Security.InvoiceSecurity.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="role")
public class RoleTest {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(length = 60)
    private String name;
}
