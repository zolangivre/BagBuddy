package bagbuddy.backend.resolvers;

import bagbuddy.backend.models.Conversation;
import bagbuddy.backend.models.Message;
import bagbuddy.backend.services.ConversationService;
import bagbuddy.backend.services.MessageService;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MessagingResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    private final ConversationService conversationService;
    private final MessageService messageService;

    public MessagingResolver(ConversationService conversationService, MessageService messageService) {
        this.conversationService = conversationService;
        this.messageService = messageService;
    }

    // Queries
    public List<Conversation> conversations() {
        return conversationService.getAllConversations();
    }

    public Conversation conversation(Long conversation_id) {
        return conversationService.getConversationById(conversation_id).orElse(null);
    }

    public List<Conversation> conversationsForUser(Integer userId) {
        return conversationService.getConversationsForUser(userId);
    }

    public List<Message> messages() {
        return messageService.getAllMessages();
    }

    public Message message(Long message_id) {
        return messageService.getMessageById(message_id).orElse(null);
    }

    public List<Message> messagesByConversationId(Long conversation_id) {
        return messageService.getMessagesByConversationId(conversation_id);
    }

    // Mutations
    public Conversation createConversation(Integer user_1_id, Integer user_2_id) {
        Conversation conversation = new Conversation();
        conversation.setUser_1_id(user_1_id);
        conversation.setUser_2_id(user_2_id);
        return conversationService.createConversation(conversation);
    }

    public Message createMessage(Integer sender_id, Integer receiver_id, Long conversation_id, String content, String status) {
        Message message = new Message();
        message.setSender_id(sender_id);
        message.setReceiver_id(receiver_id);
        message.setConversation_id(conversation_id);
        message.setContent(content);
        message.setStatus(status);
        return messageService.createMessage(message);
    }
}
