package edu.cit.lemslite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class LemsApplication {

	public static void main(String[] args) {
		SpringApplication.run(LemsApplication.class, args);
		System.out.println("backend is up and running :)");
	}
}
