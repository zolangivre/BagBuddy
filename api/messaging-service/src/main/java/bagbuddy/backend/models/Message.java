package bagbuddy.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long message_id;

    @Column(nullable = false)
    private Integer sender_id;

    @Column(nullable = false)
    private Integer receiver_id;

    @Column(nullable = false)
    private Long conversation_id;

    @Column(nullable = false)
    private String content;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime sent_at;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'sent'")
    private String status; // sent, delivered, read

    // Getters & Setters
    public Long getMessage_id() { return message_id; }
    public void setMessage_id(Long message_id) { this.message_id = message_id; }

    public Integer getSender_id() { return sender_id; }
    public void setSender_id(Integer sender_id) { this.sender_id = sender_id; }

    public Integer getReceiver_id() { return receiver_id; }
    public void setReceiver_id(Integer receiver_id) { this.receiver_id = receiver_id; }

    public Long getConversation_id() { return conversation_id; }
    public void setConversation_id(Long conversation_id) { this.conversation_id = conversation_id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getSent_at() { return sent_at; }
    public void setSent_at(LocalDateTime sent_at) { this.sent_at = sent_at; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
