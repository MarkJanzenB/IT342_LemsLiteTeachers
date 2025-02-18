package edu.cit.lemslite.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(method = RequestMethod.GET)
public class TestRun {

    @GetMapping
    public String print() {
        return "Hi this is the backend running";
    }
}