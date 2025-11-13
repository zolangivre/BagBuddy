package bagbuddy.backend.resolvers;

import bagbuddy.backend.models.Conversation;
import bagbuddy.backend.services.ConversationService;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ConversationResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    private final ConversationService conversationService;

    public ConversationResolver(ConversationService conversationService) {
        this.conversationService = conversationService;
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

    // Mutations
    public Conversation createConversation(Integer user_1_id, Integer user_2_id) {
        Conversation conversation = new Conversation();
        conversation.setUser_1_id(user_1_id);
        conversation.setUser_2_id(user_2_id);
        return conversationService.createConversation(conversation);
    }
}
