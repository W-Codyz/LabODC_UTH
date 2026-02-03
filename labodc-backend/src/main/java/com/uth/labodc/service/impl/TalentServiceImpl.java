package com.uth.labodc.service.impl;

import com.uth.labodc.model.entity.Talent;
import com.uth.labodc.repository.TalentRepository;
import com.uth.labodc.service.TalentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TalentServiceImpl implements TalentService {

    private final TalentRepository talentRepository;

    @Override
    public Talent getProfile(Long id) {
        return talentRepository.findById(id).orElse(null);
    }

    @Override
    public Talent updateProfile(Long id, Talent talent) {
        talent.setId(id);
        return talentRepository.save(talent);
    }
}
