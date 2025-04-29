package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.BorrowCartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowCartRepository extends JpaRepository<BorrowCartEntity, Integer> {
    List<BorrowCartEntity> findByInstiId(String instiId);
    BorrowCartEntity findByItemNameAndInstiId(String itemName, String instiId);
    BorrowCartEntity findByItemNameAndInstiIdAndSelectedVariant(String itemName, String instiId, String selectedVariant);
    void deleteByInstiId(String instiId);
}