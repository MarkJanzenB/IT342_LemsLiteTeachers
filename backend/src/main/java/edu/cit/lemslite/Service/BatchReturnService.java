package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.*;
import edu.cit.lemslite.Repository.BatchReturnRepository;
import edu.cit.lemslite.Repository.ItemRepository;
import edu.cit.lemslite.Repository.PreparingItemRepository;
import edu.cit.lemslite.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class BatchReturnService {

    @Autowired
    private BatchReturnRepository batchReturnRepository;
    
    @Autowired
    private PreparingItemRepository prepirepo;
    
    @Autowired
    private UserRepository userrepo;
    
    @Autowired
    private ItemRepository itemrepo;

    /*
     * TODO: review since i was sleepy af writing ts
     * */
    @Transactional
    public void addBatchReturn(int uid, String referenceCode, Map<Integer, String> itemStatuses) {
    	List<PreparingItemEntity> preparingItems = prepirepo.findByReferenceCode(referenceCode);
    	UserEntity receivedBy = userrepo.findById(uid).orElseThrow();
    	
    	for(PreparingItemEntity prepItem : preparingItems) {
        	BatchReturnEntity batch = new BatchReturnEntity();
        	batch.setDateReturned(LocalDate.now());
        	batch.setPreparingItem(prepItem);
        	batch.setReceivedBy(receivedBy);
        	prepItem.setStatus("Returned");
        	prepirepo.save(prepItem);
        	batchReturnRepository.save(batch);
    	}
    	
    	for(Map.Entry<Integer, String> entry : itemStatuses.entrySet()) {
    		Integer itemId = entry.getKey();
    		String status = entry.getValue();
    		
    		ItemEntity item = itemrepo.findById(itemId).orElseThrow();
    		if("Available".equals(status)) {
    			InventoryEntity inventory = item.getInventory();
    			inventory.setQuantity(inventory.getQuantity() + 1);
    		}
    		item.setStatus(status);
    		itemrepo.save(item);
    	}
    }

    public List<BatchReturnEntity> getAllBatchReturns() {
        return batchReturnRepository.findAll();
    }
}