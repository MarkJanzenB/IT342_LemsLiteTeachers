package edu.cit.lemslite.repository;

import edu.cit.lemslite.entity.ItemCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategoryEntity, Integer> {
}
