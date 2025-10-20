package bagbuddy.backend.services;

import bagbuddy.backend.models.Message;
import bagbuddy.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }

    public List<Message> getMessagesByConversationId(Long conversationId) {
        return messageRepository.findByConversation_id(conversationId);
    }

    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }
}
