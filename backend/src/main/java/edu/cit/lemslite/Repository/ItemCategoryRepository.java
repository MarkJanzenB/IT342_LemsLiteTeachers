package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.ItemCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategoryEntity, Integer> {
}
