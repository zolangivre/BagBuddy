package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository userRepository) {
        return args -> {
            // Créer un utilisateur
            User user = new User();
            user.setName("Jalil");
            user.setEmail("jalil@example.com");
            userRepository.save(user);

            // Afficher tous les utilisateurs
            System.out.println("Liste des utilisateurs :");
            userRepository.findAll().forEach(u -> System.out.println(u.getName() + " - " + u.getEmail()));
        };
    }
}
