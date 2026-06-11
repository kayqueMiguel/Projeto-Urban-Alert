package com.example.urban_alert.service;

import com.example.urban_alert.model.Denuncia;
import com.example.urban_alert.repository.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DenunciaService {

    @Autowired
    private DenunciaRepository repository;

    public Denuncia registrarDenuncia(Denuncia denuncia) {
        return repository.save(denuncia);
    }

    public List<Denuncia> listarTodas() {
        return repository.findAll();
    }
}