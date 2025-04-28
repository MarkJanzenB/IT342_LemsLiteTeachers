package edu.cit.lemslite.DTO;

import java.util.Map;


public class BatchReturnRequestDTO {
	private String referenceCode;
	private Map<Integer, String> itemStatuses;
	public String getReferenceCode() {
		return referenceCode;
	}
	public void setReferenceCode(String referenceCode) {
		this.referenceCode = referenceCode;
	}
	public Map<Integer, String> getItemStatuses() {
		return itemStatuses;
	}
	public void setItemStatuses(Map<Integer, String> itemStatuses) {
		this.itemStatuses = itemStatuses;
	}
	
}
