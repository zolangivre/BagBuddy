package bagbuddy.backend.repository;

import bagbuddy.backend.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversation_id(Long conversationId);
    List<Message> findBySender_id(Integer senderId);
    List<Message> findByReceiver_id(Integer receiverId);
}
