package edu.cit.lemslite.Service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepRenderAwakeService {
	private static final String PING_URL = "https://cit-lems-backend.onrender.com/user/message";
	private final RestTemplate restTemplate = new RestTemplate();
	
	@Scheduled(fixedDelay = 600000) // 10 minutes
	public void ping() {
		try {
			restTemplate.getForObject(PING_URL, String.class);
			System.out.println("Pinged successfully to prevent sleeping");
		}catch(Exception e) {
			System.out.println("Ping failed: " + e.getMessage());
		}
	}
}
