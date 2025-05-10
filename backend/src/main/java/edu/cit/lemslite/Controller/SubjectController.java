package edu.cit.lemslite.Controller;

import edu.cit.lemslite.Entity.SubjectEntity;
import edu.cit.lemslite.Service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subject")
@CrossOrigin(origins = "https://lems-lite.vercel.app")
public class SubjectController {

    @Autowired
    SubjectService sserv;

    @PostMapping("/addsubject")
    public SubjectEntity addSubject(@RequestBody SubjectEntity subject){
     return sserv.addSubject(subject);
    }
    @GetMapping("/getallsubject")
    public List<SubjectEntity> getAllSubject(){
        return sserv.getAllSubject();
    }
//    @PutMapping("/updatesubject/{subject_id}")
//    public SubjectEntity updateSubject(@RequestBody SubjectEntity subject, @PathVariable int subject_id){
//        return sserv.updateSubject(subject,subject_id);
//    }
    @DeleteMapping("/deleteSubject/{subject_id}")
    public void deleteSubject(@PathVariable int subject_id){
        sserv.deleteSubject(subject_id);
    }
}
