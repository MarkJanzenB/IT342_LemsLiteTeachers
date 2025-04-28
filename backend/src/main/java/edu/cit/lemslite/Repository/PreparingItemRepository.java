package edu.cit.lemslite.Repository;

import edu.cit.lemslite.Entity.PreparingItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PreparingItemRepository extends JpaRepository<PreparingItemEntity, Integer> {
    List<PreparingItemEntity> findByInstiIdAndStatus(String instiId, String status);
    List<PreparingItemEntity> findByStatus(String status);
    List<PreparingItemEntity> findByReferenceCode(String referenceCode);
}
