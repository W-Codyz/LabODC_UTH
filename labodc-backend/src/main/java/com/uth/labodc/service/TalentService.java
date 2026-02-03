package com.uth.labodc.service;

import com.uth.labodc.model.entity.Talent;

public interface TalentService {
    Talent getProfile(Long id);
    Talent updateProfile(Long id, Talent talent);
}
