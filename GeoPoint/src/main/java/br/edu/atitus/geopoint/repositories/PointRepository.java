package br.edu.atitus.geopoint.repositories;

import br.edu.atitus.geopoint.entities.PointEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class PointRepository {
    // declarando uma dependencia da classe
    private final JdbcTemplate jdbcTemplate;


    //injeçõo de dependencia via Construtor
    public PointRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<PointEntity> mapper = (rs, i) -> {
        PointEntity point = new PointEntity();
        point.setId(rs.getObject("id", UUID.class));
        point.setName(rs.getString("name"));
        point.setDescription(rs.getString("description"));
        point.setLatitude(rs.getBigDecimal("latitude"));
        point.setLongitude(rs.getBigDecimal("longitude"));
        return point;

    };
    public PointEntity insert(PointEntity point) {

        String sql = """
        INSERT INTO points (
            id, name, description, latitude, longitude
        )
        VALUES (?, ?, ?, ?, ?)
        """;

        jdbcTemplate.update(
                sql,
                point.getId(),
                point.getName(),
                point.getDescription(),
                point.getLatitude(),
                point.getLongitude()
        );

        return point;
    }

    public List<PointEntity> findAll() {
        String sql = "SELECT id, name, description, latitude, longitude FROM points ORDER BY name";
        return jdbcTemplate.query(sql, mapper);
    }

    public Optional<PointEntity> findById(UUID id) {
        String sql = "SELECT id, name, description, latitude, longitude FROM points WHERE id + ?";
        return jdbcTemplate.query(sql, mapper, id).stream().findFirst();

    }

    public void update(PointEntity point) {
        String sql = """
        UPDATE points
        SET name = ?, description = ?, latitude = ?, longitude = ? 
        WHERE id = ?
        """;

        jdbcTemplate.update(
                sql,
                point.getName(),
                point.getDescription(),
                point.getLatitude(),
                point.getLongitude(),
                point.getId()
        );
    }

    public void delete(UUID id) {
        jdbcTemplate.update("DELETE FROM points WHERE id = ?", id);
    }

}
