package com.bagbuddy.repository;

import com.bagbuddy.model.Conversation;
import com.bagbuddy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUser1OrUser2(User user1, User user2);
}
