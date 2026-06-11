package com.example.urban_alert.controller;

import com.example.urban_alert.model.Denuncia;
import com.example.urban_alert.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/denuncias")
public class DenunciaController {

    @Autowired
    private DenunciaService service;

    // Rota para CRIAR uma denúncia (Enviada pelo teu formulário HTML/JS)
    @PostMapping
    public ResponseEntity<Denuncia> criar(@RequestBody Denuncia denuncia) {
        Denuncia novaDenuncia = service.registrarDenuncia(denuncia);
        return new ResponseEntity<>(novaDenuncia, HttpStatus.CREATED);
    }

    // Rota para LISTAR todas as denúncias caso queiram mostrar numa tela no futuro
    @GetMapping
    public ResponseEntity<List<Denuncia>> listar() {
        List<Denuncia> lista = service.listarTodas();
        return ResponseEntity.ok(lista);
    }
}