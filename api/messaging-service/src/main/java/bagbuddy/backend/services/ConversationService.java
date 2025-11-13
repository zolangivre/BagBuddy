package bagbuddy.backend.services;

import bagbuddy.backend.models.Conversation;
import bagbuddy.backend.repository.ConversationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public Optional<Conversation> getConversationById(Long id) {
        return conversationRepository.findById(id);
    }

    public List<Conversation> getConversationsForUser(Integer userId) {
        return conversationRepository.findByUser_1_idOrUser_2_id(userId, userId);
    }

    public Conversation createConversation(Conversation conversation) {
        return conversationRepository.save(conversation);
    }
}
