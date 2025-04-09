package edu.cit.lemslite.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import edu.cit.lemslite.Entity.UserEntity;
import edu.cit.lemslite.Repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService{
	
	@Autowired
	private UserRepository userrepo;

	@Override
	public UserDetails loadUserByUsername(String instiId) throws UsernameNotFoundException {
		UserEntity user = userrepo.findByInstiId(instiId);
		
		if(user == null) {
			System.out.println("User not found");
			throw new UsernameNotFoundException("User not found");
		}
		return org.springframework.security.core.userdetails.User.builder()
				.username(user.getInstiId())
				.password(user.getPassword())
				.build();
	}

}
