package br.edu.atitus.geopoint.services;

import br.edu.atitus.geopoint.dtos.PointRequest;
import br.edu.atitus.geopoint.entities.PointEntity;
import br.edu.atitus.geopoint.repositories.PointRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class PointService {
    private final PointRepository repository;

    public PointService(PointRepository repository) {
        this.repository = repository;
    }

    private ResponseStatusException erro(String mensagem) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, mensagem);
    }
    private ResponseStatusException naoEncontrado(){
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado");

    }
    private UUID converterId(String id)  {
        try {
            return UUID.fromString(id);
        }catch (IllegalArgumentException e) {
            throw naoEncontrado();
        }
    }

    private void validar(PointRequest pointRequest) {
        if (pointRequest == null)
            throw erro("Obejto Nulo");
        if (pointRequest.name() == null || pointRequest.name().isBlank())
            throw erro("Nome Invalido");
        if (pointRequest.name().trim().length() > 100)
            throw erro("Nome de ter no máximo 100 caracteres");
        if (pointRequest.description() != null && pointRequest.description().trim().length() > 255)
            throw erro("Descrição deve ter no máximo 255 caracteres");
        if (pointRequest.latitude() == null
                || pointRequest.latitude().compareTo(BigDecimal.valueOf(-90)) < 0
                || pointRequest.latitude().compareTo(BigDecimal.valueOf(90)) > 0)
            throw erro("Latitude invalida - intervalo -90 a 90");
        if (pointRequest.longitude() == null
                || pointRequest.longitude().compareTo(BigDecimal.valueOf(-180)) < 0
                || pointRequest.longitude().compareTo(BigDecimal.valueOf(180)) > 0)
            throw erro("Longitude invalida - Intervalo aceito: -180 a 180");
    }

    private PointEntity montar(UUID id, PointRequest pointRequest) {
        PointEntity point = new PointEntity();
        point.setId(id);
        point.setName(pointRequest.name().trim());
        point.setDescription(pointRequest.description() == null ? null : pointRequest.description().trim());
        point.setLatitude(pointRequest.latitude());
        point.setLongitude(pointRequest.longitude());
        return point;
    }

    public PointEntity insert(PointRequest pointRequest) {
        validar(pointRequest);
        return repository.insert(montar(UUID.randomUUID(), pointRequest));
    }
    public List<PointEntity> findAll(){
        return repository.findAll();
    }
    public PointEntity findById(String id) {
        return repository.findById(converterId(id)).orElseThrow(this::naoEncontrado);
    }

    public PointEntity update(String id, PointRequest pointRequest){
        validar(pointRequest);
        UUID uuid = converterId(id);
        repository.findById(uuid).orElseThrow(this::naoEncontrado);

        PointEntity point = montar(uuid, pointRequest);
        repository.update(point);
        return point;
    }

    public void delete ( String id) {
        UUID uuid = converterId(id);
        repository.findById(uuid).orElseThrow(this::naoEncontrado);
        repository.delete(uuid);
    }
}
