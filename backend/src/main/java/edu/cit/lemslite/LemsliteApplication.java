package edu.cit.lemslite;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication

public class LemsliteApplication {

	public static void main(String[] args) {
		SpringApplication.run(LemsliteApplication.class, args);
		System.out.println("backend is up and running :)");
	}

}
