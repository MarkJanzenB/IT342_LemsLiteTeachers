package edu.cit.lemslite.Service;

import edu.cit.lemslite.Entity.GroupEntity;
import edu.cit.lemslite.Repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    @Autowired
    GroupRepository grepo;

    //add group
    public GroupEntity addGroup(GroupEntity group){
        return grepo.save(group);
    }
    //display all
    public List<GroupEntity> getAllGroup(){
        return grepo.findAll();
    }
    //update group
    public GroupEntity updateGroup(GroupEntity updatedGroup, int group_id){
        GroupEntity existingGroup = grepo.findById(group_id).orElseThrow(()-> new IllegalArgumentException("Group ID not found"));
        existingGroup.setGroup_name(updatedGroup.getGroup_name());
        return grepo.save(existingGroup);
    }
    //delete
    public void deleteGroup(int group_id){
        GroupEntity group = grepo.findById(group_id).orElseThrow(()-> new IllegalArgumentException("Group ID not found"));
        grepo.deleteById(group_id);
    }


}
