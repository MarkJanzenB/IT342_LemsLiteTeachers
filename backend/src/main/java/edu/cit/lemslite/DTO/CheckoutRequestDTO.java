package edu.cit.lemslite.DTO;

import java.util.Map;

public class CheckoutRequestDTO {
	private Map<Integer, Integer> itemQuantities;
	private Map<Integer, Map<String, String>> uniqueIdsMap;
	
	public Map<Integer, Integer> getItemQuantities() {
		return itemQuantities;
	}
	public void setItemQuantities(Map<Integer, Integer> getItemQuantities) {
		this.itemQuantities = getItemQuantities;
	}
	public Map<Integer, Map<String, String>> getUniqueIdsMap() {
		return uniqueIdsMap;
	}
	public void setUniqueIdsMap(Map<Integer, Map<String, String>> uniqueIdsMap) {
		this.uniqueIdsMap = uniqueIdsMap;
	}
	
	
}
