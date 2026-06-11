package com.example.urban_alert.repository;

import com.example.urban_alert.model.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {
    // Não precisa digitar nada aqui dentro, o Spring faz a mágica do banco sozinho!
}