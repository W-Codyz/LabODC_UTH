package com.uth.labodc.controller;

import com.uth.labodc.model.entity.Talent;
import com.uth.labodc.service.TalentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/talent")
@RequiredArgsConstructor
public class TalentController {

    private final TalentService talentService;

    @GetMapping("/{id}")
    public Talent getProfile(@PathVariable Long id) {
        return talentService.getProfile(id);
    }

    @PutMapping("/{id}")
    public Talent updateProfile(@PathVariable Long id, @RequestBody Talent talent) {
        return talentService.updateProfile(id, talent);
    }
}
