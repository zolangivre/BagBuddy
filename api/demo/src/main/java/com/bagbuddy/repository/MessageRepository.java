package com.bagbuddy.repository;

import com.bagbuddy.model.Message;
import com.bagbuddy.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
    List<Message> findByConversationId(Long conversationId);
}
