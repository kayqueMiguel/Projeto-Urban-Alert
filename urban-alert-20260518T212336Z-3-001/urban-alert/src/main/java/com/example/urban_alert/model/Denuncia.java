package com.example.urban_alert.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "denuncias")
@Data // O Lombok usa isso para criar os Getters/Setters automaticamente!
public class Denuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_problema", nullable = false)
    private String tipoProblema;

    @Column(nullable = false)
    private String endereco;

    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Column(name = "url_foto")
    private String urlFoto;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();
}