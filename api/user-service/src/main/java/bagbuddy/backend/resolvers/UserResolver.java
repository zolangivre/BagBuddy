package bagbuddy.backend.resolvers;

import bagbuddy.backend.models.User;
import bagbuddy.backend.services.UserService;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserResolver implements GraphQLQueryResolver, GraphQLMutationResolver {

    private final UserService userService;

    public UserResolver(UserService userService) {
        this.userService = userService;
    }

    // Queries
    public List<User> users() {
        return userService.getAllUsers();
    }

    public User user(Long user_id) {
        return userService.getUserById(user_id).orElse(null);
    }

    // Mutations
    public User createUser(String firstname, String lastname, String email, String password,
                           String phone, String profile_picture) {
        User user = new User();
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setEmail(email);
        user.setPassword(password);
        user.setPhone(phone);
        user.setProfile_picture(profile_picture);
        return userService.createUser(user);
    }
}
