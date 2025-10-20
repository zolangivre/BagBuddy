package bagbuddy.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversation_id;

    @Column(nullable = false)
    private Integer user_1_id;

    @Column(nullable = false)
    private Integer user_2_id;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime created_at;

    // Getters & Setters
    public Long getConversation_id() { return conversation_id; }
    public void setConversation_id(Long conversation_id) { this.conversation_id = conversation_id; }

    public Integer getUser_1_id() { return user_1_id; }
    public void setUser_1_id(Integer user_1_id) { this.user_1_id = user_1_id; }

    public Integer getUser_2_id() { return user_2_id; }
    public void setUser_2_id(Integer user_2_id) { this.user_2_id = user_2_id; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
}
