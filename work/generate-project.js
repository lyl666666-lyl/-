const fs = require('fs');
const path = require('path');

const root = 'D:/codex/旅游管理系统-20260622';
const backend = path.join(root, 'tourism-backend');
const frontend = path.join(root, 'tourism-frontend');

function w(file, content) {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart().replace(/\n/g, '\r\n'), 'utf8');
}

const javaBase = 'com.example.tourism';
const pkg = (name) => `package ${javaBase}.${name};`;
const entityDir = 'tourism-backend/src/main/java/com/example/tourism/entity';
const mapperDir = 'tourism-backend/src/main/java/com/example/tourism/mapper';
const serviceDir = 'tourism-backend/src/main/java/com/example/tourism/service';
const implDir = 'tourism-backend/src/main/java/com/example/tourism/service/impl';
const controllerDir = 'tourism-backend/src/main/java/com/example/tourism/controller';

w('tourism-backend/pom.xml', `
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.6</version>
    <relativePath/>
  </parent>
  <groupId>com.example</groupId>
  <artifactId>tourism-backend</artifactId>
  <version>1.0.0</version>
  <name>tourism-backend</name>
  <properties>
    <java.version>17</java.version>
    <mybatis-plus.version>3.5.7</mybatis-plus.version>
    <jjwt.version>0.12.6</jjwt.version>
  </properties>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>com.baomidou</groupId><artifactId>mybatis-plus-spring-boot3-starter</artifactId><version>\${mybatis-plus.version}</version></dependency>
    <dependency><groupId>com.mysql</groupId><artifactId>mysql-connector-j</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId><version>\${jjwt.version}</version></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId><version>\${jjwt.version}</version><scope>runtime</scope></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId><version>\${jjwt.version}</version><scope>runtime</scope></dependency>
    <dependency><groupId>org.apache.poi</groupId><artifactId>poi-ooxml</artifactId><version>5.3.0</version></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
    </plugins>
  </build>
</project>`);

w('tourism-backend/src/main/resources/application.yml', `
server:
  port: 8080
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/tourism_system?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: 123456
  jackson:
    time-zone: Asia/Shanghai
    date-format: yyyy-MM-dd HH:mm:ss
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
  global-config:
    db-config:
      id-type: auto
jwt:
  secret: tourism-course-design-secret-key-please-change-20260622
  expire-hours: 24
`);

w('tourism-backend/src/main/java/com/example/tourism/TourismApplication.java', `
package com.example.tourism;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.tourism.mapper")
public class TourismApplication {
    public static void main(String[] args) {
        SpringApplication.run(TourismApplication.class, args);
    }
}`);

w('tourism-backend/src/main/java/com/example/tourism/common/Result.java', `
${pkg('common')}

import lombok.Data;

@Data
public class Result<T> {
    private int code;
    private String message;
    private T data;

    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> Result<T> ok() { return new Result<>(200, "操作成功", null); }
    public static <T> Result<T> ok(T data) { return new Result<>(200, "操作成功", data); }
    public static <T> Result<T> fail(String message) { return new Result<>(500, message, null); }
    public static <T> Result<T> unauthorized(String message) { return new Result<>(401, message, null); }
    public static <T> Result<T> forbidden(String message) { return new Result<>(403, message, null); }
}`);

w('tourism-backend/src/main/java/com/example/tourism/exception/BusinessException.java', `
${pkg('exception')}

public class BusinessException extends RuntimeException {
    public BusinessException(String message) { super(message); }
}`);

w('tourism-backend/src/main/java/com/example/tourism/exception/GlobalExceptionHandler.java', `
${pkg('exception')}

import com.example.tourism.common.Result;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public Result<Void> business(BusinessException e) { return Result.fail(e.getMessage()); }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> valid(MethodArgumentNotValidException e) {
        return Result.fail(e.getBindingResult().getFieldError() == null ? "参数校验失败" : e.getBindingResult().getFieldError().getDefaultMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> denied() { return Result.forbidden("无权限访问"); }

    @ExceptionHandler(Exception.class)
    public Result<Void> error(Exception e) {
        e.printStackTrace();
        return Result.fail(e.getMessage());
    }
}`);

w('tourism-backend/src/main/java/com/example/tourism/config/MybatisPlusConfig.java', `
${pkg('config')}

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MybatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return interceptor;
    }
}`);

w('tourism-backend/src/main/java/com/example/tourism/config/CorsConfig.java', `
${pkg('config')}

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}`);

w('tourism-backend/src/main/java/com/example/tourism/security/UserPrincipal.java', `
${pkg('security')}

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserPrincipal {
    private Long id;
    private String username;
    private String role;
}`);

w('tourism-backend/src/main/java/com/example/tourism/utils/JwtUtil.java', `
${pkg('utils')}

import com.example.tourism.security.UserPrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("\${jwt.secret}")
    private String secret;
    @Value("\${jwt.expire-hours}")
    private long expireHours;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(Long userId, String username, String role) {
        Date now = new Date();
        Date expire = new Date(now.getTime() + expireHours * 3600_000L);
        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expire)
                .signWith(key())
                .compact();
    }

    public UserPrincipal parse(String token) {
        Claims claims = Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
        Long userId = Long.valueOf(String.valueOf(claims.get("userId")));
        String role = String.valueOf(claims.get("role"));
        return new UserPrincipal(userId, claims.getSubject(), role);
    }
}`);

w('tourism-backend/src/main/java/com/example/tourism/security/JwtAuthFilter.java', `
${pkg('security')}

import com.example.tourism.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                UserPrincipal principal = jwtUtil.parse(auth.substring(7));
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        principal, null, List.of(new SimpleGrantedAuthority("ROLE_" + principal.getRole())));
                SecurityContextHolder.getContext().setAuthentication(token);
            } catch (Exception ignored) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}`);

w('tourism-backend/src/main/java/com/example/tourism/security/SecurityConfig.java', `
${pkg('security')}

import com.example.tourism.common.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e.authenticationEntryPoint((req, res, ex) -> {
                    res.setStatus(401);
                    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    res.getWriter().write(objectMapper.writeValueAsString(Result.unauthorized("请先登录")));
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/spots/**", "/api/routes/**", "/api/packages/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}`);

w('tourism-backend/src/main/java/com/example/tourism/utils/SecurityUtil.java', `
${pkg('utils')}

import com.example.tourism.exception.BusinessException;
import com.example.tourism.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
    public static UserPrincipal current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new BusinessException("请先登录");
        }
        return principal;
    }

    public static boolean isAdmin() {
        try { return "ADMIN".equals(current().getRole()); } catch (Exception e) { return false; }
    }
}`);

const entities = [
  ['SysUser','sys_user',`private Long id;|private String username;|private String password;|private String realName;|private String phone;|private String email;|private String role;|private String avatar;|private String status;|private LocalDateTime createTime;|private LocalDateTime updateTime;`],
  ['Traveler','traveler',`private Long id;|private Long userId;|private String name;|private String gender;|private String idCard;|private String phone;|private String remark;|private LocalDateTime createTime;`],
  ['ScenicSpot','scenic_spot',`private Long id;|private String name;|private String location;|private String level;|private String coverImage;|private String description;|private String status;|private LocalDateTime createTime;`],
  ['TravelRoute','travel_route',`private Long id;|private String routeName;|private Long spotId;|private Integer days;|private BigDecimal price;|private Integer maxPeople;|private String coverImage;|private String itinerary;|private String description;|private String status;|private LocalDateTime createTime;|private LocalDateTime updateTime;`],
  ['TourPackage','tour_package',`private Long id;|private Long routeId;|private String packageName;|private String packageType;|private BigDecimal price;|private String includeService;|private String excludeService;|private String status;|private LocalDateTime createTime;`],
  ['TourOrder','tour_order',`private Long id;|private String orderNo;|private Long userId;|private Long routeId;|private Long packageId;|private LocalDate travelDate;|private Integer peopleCount;|private BigDecimal totalAmount;|private String contactName;|private String contactPhone;|private String status;|private String returnReason;|private LocalDateTime createTime;|private LocalDateTime updateTime;`],
  ['OrderTraveler','order_traveler',`private Long id;|private Long orderId;|private Long travelerId;|private String travelerName;|private String idCard;|private String phone;`],
  ['Guide','guide',`private Long id;|private String name;|private String phone;|private String level;|private String status;`],
  ['TravelArrangement','travel_arrangement',`private Long id;|private Long orderId;|private Long guideId;|private String batchNo;|private LocalDateTime departTime;|private String gatherPlace;|private String reminder;|private LocalDateTime createTime;`],
  ['AfterSale','after_sale',`private Long id;|private Long orderId;|private Long userId;|private String type;|private String content;|private String status;|private String reply;|private LocalDateTime createTime;|private LocalDateTime updateTime;`],
  ['OrderLog','order_log',`private Long id;|private Long orderId;|private Long operatorId;|private String operatorRole;|private String action;|private String remark;|private LocalDateTime createTime;`]
];

for (const [name, table, fields] of entities) {
  w(`${entityDir}/${name}.java`, `
${pkg('entity')}

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("${table}")
public class ${name} {
    @TableId(type = IdType.AUTO)
    private Long id;
    ${fields.split('|').filter(f => !f.includes('Long id')).join('\n    ')}
}`);
  w(`${mapperDir}/${name}Mapper.java`, `
${pkg('mapper')}

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.tourism.entity.${name};

public interface ${name}Mapper extends BaseMapper<${name}> {
}`);
  w(`${serviceDir}/${name}Service.java`, `
${pkg('service')}

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.tourism.entity.${name};

public interface ${name}Service extends IService<${name}> {
}`);
  w(`${implDir}/${name}ServiceImpl.java`, `
${pkg('service.impl')}

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.tourism.entity.${name};
import com.example.tourism.mapper.${name}Mapper;
import com.example.tourism.service.${name}Service;
import org.springframework.stereotype.Service;

@Service
public class ${name}ServiceImpl extends ServiceImpl<${name}Mapper, ${name}> implements ${name}Service {
}`);
}

const dtoDir = 'tourism-backend/src/main/java/com/example/tourism/dto';
[
 ['LoginRequest', 'import jakarta.validation.constraints.NotBlank;', '@NotBlank(message = "用户名不能为空") private String username;|@NotBlank(message = "密码不能为空") private String password;'],
 ['RegisterRequest', 'import jakarta.validation.constraints.NotBlank;', '@NotBlank(message = "用户名不能为空") private String username;|@NotBlank(message = "密码不能为空") private String password;|private String realName;|private String phone;|private String email;'],
 ['PasswordRequest', 'import jakarta.validation.constraints.NotBlank;', '@NotBlank(message = "旧密码不能为空") private String oldPassword;|@NotBlank(message = "新密码不能为空") private String newPassword;'],
 ['OrderCreateRequest', 'import jakarta.validation.constraints.*; import java.time.LocalDate; import java.util.List;', '@NotNull private Long routeId;|private Long packageId;|@NotNull private LocalDate travelDate;|@Min(value = 1, message = "预订人数必须大于0") private Integer peopleCount;|@NotBlank private String contactName;|@NotBlank private String contactPhone;|@NotEmpty private List<Long> travelerIds;'],
 ['OrderUpdateRequest', 'import jakarta.validation.constraints.*; import java.time.LocalDate; import java.util.List;', '@NotNull private LocalDate travelDate;|@Min(value = 1, message = "预订人数必须大于0") private Integer peopleCount;|private Long packageId;|@NotBlank private String contactName;|@NotBlank private String contactPhone;|@NotEmpty private List<Long> travelerIds;'],
 ['ReturnOrderRequest', 'import jakarta.validation.constraints.NotBlank;', '@NotBlank(message = "退回原因不能为空") private String reason;'],
 ['ArrangementRequest', 'import jakarta.validation.constraints.*; import java.time.LocalDateTime;', '@NotNull private Long orderId;|@NotNull private Long guideId;|@NotBlank private String batchNo;|@NotNull private LocalDateTime departTime;|@NotBlank private String gatherPlace;|private String reminder;'],
 ['AfterSaleRequest', 'import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.NotNull;', '@NotNull private Long orderId;|@NotBlank private String type;|@NotBlank private String content;'],
 ['ReplyAfterSaleRequest', 'import jakarta.validation.constraints.NotBlank;', '@NotBlank private String status;|private String reply;']
].forEach(([name, imports, fields]) => w(`${dtoDir}/${name}.java`, `
${pkg('dto')}

${imports}
import lombok.Data;

@Data
public class ${name} {
    ${fields.split('|').join('\n    ')}
}`));

w('tourism-backend/src/main/java/com/example/tourism/vo/LoginVO.java', `
${pkg('vo')}

import com.example.tourism.entity.SysUser;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginVO {
    private String token;
    private SysUser user;
    private String role;
}`);

w(`${controllerDir}/AuthController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.LoginRequest;
import com.example.tourism.dto.RegisterRequest;
import com.example.tourism.entity.SysUser;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.SysUserService;
import com.example.tourism.utils.JwtUtil;
import com.example.tourism.vo.LoginVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final SysUserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginRequest req) {
        SysUser user = userService.getOne(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, req.getUsername()));
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) throw new BusinessException("用户名或密码错误");
        if (!"ENABLE".equals(user.getStatus())) throw new BusinessException("账号已禁用");
        String token = jwtUtil.generate(user.getId(), user.getUsername(), user.getRole());
        user.setPassword(null);
        return Result.ok(new LoginVO(token, user, user.getRole()));
    }

    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterRequest req) {
        long count = userService.count(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, req.getUsername()));
        if (count > 0) throw new BusinessException("用户名不能重复");
        SysUser user = new SysUser();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRealName(req.getRealName());
        user.setPhone(req.getPhone());
        user.setEmail(req.getEmail());
        user.setRole("TOURIST");
        user.setStatus("ENABLE");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        userService.save(user);
        return Result.ok();
    }

    @PostMapping("/logout")
    public Result<Void> logout() { return Result.ok(); }
}`);

w(`${controllerDir}/UserController.java`, `
${pkg('controller')}

import com.example.tourism.common.Result;
import com.example.tourism.dto.PasswordRequest;
import com.example.tourism.entity.SysUser;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.SysUserService;
import com.example.tourism.utils.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final SysUserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public Result<SysUser> profile() {
        SysUser user = userService.getById(SecurityUtil.current().getId());
        user.setPassword(null);
        return Result.ok(user);
    }

    @PutMapping("/profile")
    public Result<Void> update(@RequestBody SysUser body) {
        SysUser user = userService.getById(SecurityUtil.current().getId());
        user.setRealName(body.getRealName());
        user.setPhone(body.getPhone());
        user.setEmail(body.getEmail());
        user.setAvatar(body.getAvatar());
        user.setUpdateTime(LocalDateTime.now());
        userService.updateById(user);
        return Result.ok();
    }

    @PutMapping("/password")
    public Result<Void> password(@Valid @RequestBody PasswordRequest req) {
        SysUser user = userService.getById(SecurityUtil.current().getId());
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) throw new BusinessException("旧密码错误");
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        user.setUpdateTime(LocalDateTime.now());
        userService.updateById(user);
        return Result.ok();
    }
}`);

w(`${controllerDir}/TravelerController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.Traveler;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.TravelerService;
import com.example.tourism.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/travelers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TOURIST')")
public class TravelerController {
    private final TravelerService service;

    @GetMapping
    public Result<List<Traveler>> list() {
        return Result.ok(service.list(new LambdaQueryWrapper<Traveler>().eq(Traveler::getUserId, SecurityUtil.current().getId()).orderByDesc(Traveler::getId)));
    }

    @PostMapping
    public Result<Void> add(@RequestBody Traveler t) {
        t.setUserId(SecurityUtil.current().getId());
        t.setCreateTime(LocalDateTime.now());
        service.save(t);
        return Result.ok();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody Traveler t) {
        Traveler old = mustOwn(id);
        old.setName(t.getName()); old.setGender(t.getGender()); old.setIdCard(t.getIdCard()); old.setPhone(t.getPhone()); old.setRemark(t.getRemark());
        service.updateById(old);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        mustOwn(id);
        service.removeById(id);
        return Result.ok();
    }

    private Traveler mustOwn(Long id) {
        Traveler t = service.getById(id);
        if (t == null || !t.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("只能管理自己的常用出行人");
        return t;
    }
}`);

w(`${controllerDir}/SpotController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.tourism.common.Result;
import com.example.tourism.entity.ScenicSpot;
import com.example.tourism.service.ScenicSpotService;
import com.example.tourism.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class SpotController {
    private final ScenicSpotService service;

    @GetMapping("/api/spots")
    public Result<Page<ScenicSpot>> list(@RequestParam(defaultValue = "1") long page, @RequestParam(defaultValue = "10") long size,
      String name, String location, String status) {
        LambdaQueryWrapper<ScenicSpot> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(name)) qw.like(ScenicSpot::getName, name);
        if (StringUtils.hasText(location)) qw.like(ScenicSpot::getLocation, location);
        if (StringUtils.hasText(status) && SecurityUtil.isAdmin()) qw.eq(ScenicSpot::getStatus, status);
        if (!SecurityUtil.isAdmin()) qw.eq(ScenicSpot::getStatus, "ENABLE");
        qw.orderByDesc(ScenicSpot::getId);
        return Result.ok(service.page(new Page<>(page, size), qw));
    }

    @GetMapping("/api/spots/{id}")
    public Result<ScenicSpot> detail(@PathVariable Long id) { return Result.ok(service.getById(id)); }

    @PostMapping("/api/admin/spots")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> add(@RequestBody ScenicSpot spot) { spot.setCreateTime(LocalDateTime.now()); if (spot.getStatus()==null) spot.setStatus("ENABLE"); service.save(spot); return Result.ok(); }

    @PutMapping("/api/admin/spots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id, @RequestBody ScenicSpot spot) { spot.setId(id); service.updateById(spot); return Result.ok(); }

    @DeleteMapping("/api/admin/spots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) { service.removeById(id); return Result.ok(); }

    @PutMapping("/api/admin/spots/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> status(@PathVariable Long id, @RequestParam String status) { ScenicSpot s = service.getById(id); s.setStatus(status); service.updateById(s); return Result.ok(); }
}`);

w(`${controllerDir}/RouteController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.tourism.common.Result;
import com.example.tourism.entity.*;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class RouteController {
    private final TravelRouteService routeService;
    private final ScenicSpotService spotService;
    private final TourPackageService packageService;

    @GetMapping("/api/routes")
    public Result<Page<TravelRoute>> list(@RequestParam(defaultValue = "1") long page, @RequestParam(defaultValue = "10") long size,
      String keyword, Long spotId, Integer days, String status, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice) {
        LambdaQueryWrapper<TravelRoute> qw = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) qw.like(TravelRoute::getRouteName, keyword);
        if (spotId != null) qw.eq(TravelRoute::getSpotId, spotId);
        if (days != null) qw.eq(TravelRoute::getDays, days);
        if (minPrice != null) qw.ge(TravelRoute::getPrice, minPrice);
        if (maxPrice != null) qw.le(TravelRoute::getPrice, maxPrice);
        if (StringUtils.hasText(status) && SecurityUtil.isAdmin()) qw.eq(TravelRoute::getStatus, status);
        if (!SecurityUtil.isAdmin()) qw.eq(TravelRoute::getStatus, "ON_SALE");
        qw.orderByDesc(TravelRoute::getId);
        return Result.ok(routeService.page(new Page<>(page, size), qw));
    }

    @GetMapping("/api/routes/{id}")
    public Result<Map<String,Object>> detail(@PathVariable Long id) {
        TravelRoute route = routeService.getById(id);
        Map<String,Object> map = new LinkedHashMap<>();
        map.put("route", route);
        map.put("spot", route == null ? null : spotService.getById(route.getSpotId()));
        map.put("packages", packageService.list(new LambdaQueryWrapper<TourPackage>().eq(TourPackage::getRouteId, id).eq(TourPackage::getStatus, "ENABLE")));
        return Result.ok(map);
    }

    @PostMapping("/api/admin/routes") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> add(@RequestBody TravelRoute r) { r.setCreateTime(LocalDateTime.now()); r.setUpdateTime(LocalDateTime.now()); if(r.getStatus()==null)r.setStatus("ON_SALE"); routeService.save(r); return Result.ok(); }
    @PutMapping("/api/admin/routes/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id,@RequestBody TravelRoute r) { r.setId(id); r.setUpdateTime(LocalDateTime.now()); routeService.updateById(r); return Result.ok(); }
    @DeleteMapping("/api/admin/routes/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id) { routeService.removeById(id); return Result.ok(); }
    @PutMapping("/api/admin/routes/{id}/off-sale") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> off(@PathVariable Long id) { TravelRoute r=routeService.getById(id); r.setStatus("OFF_SALE"); routeService.updateById(r); return Result.ok(); }
    @PutMapping("/api/admin/routes/{id}/on-sale") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> on(@PathVariable Long id) { TravelRoute r=routeService.getById(id); r.setStatus("ON_SALE"); routeService.updateById(r); return Result.ok(); }
}`);

w(`${controllerDir}/PackageController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.entity.TourPackage;
import com.example.tourism.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PackageController {
    private final TourPackageService service;
    @GetMapping("/api/packages")
    public Result<List<TourPackage>> list(Long routeId) {
        LambdaQueryWrapper<TourPackage> qw = new LambdaQueryWrapper<>();
        if (routeId != null) qw.eq(TourPackage::getRouteId, routeId);
        qw.eq(TourPackage::getStatus, "ENABLE").orderByDesc(TourPackage::getId);
        return Result.ok(service.list(qw));
    }
    @GetMapping("/api/packages/{id}") public Result<TourPackage> detail(@PathVariable Long id){ return Result.ok(service.getById(id));}
    @PostMapping("/api/admin/packages") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> add(@RequestBody TourPackage p){ p.setCreateTime(LocalDateTime.now()); if(p.getStatus()==null)p.setStatus("ENABLE"); service.save(p); return Result.ok();}
    @PutMapping("/api/admin/packages/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> update(@PathVariable Long id,@RequestBody TourPackage p){ p.setId(id); service.updateById(p); return Result.ok();}
    @DeleteMapping("/api/admin/packages/{id}") @PreAuthorize("hasRole('ADMIN')")
    public Result<Void> delete(@PathVariable Long id){ service.removeById(id); return Result.ok();}
}`);

w(`${controllerDir}/OrderController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.*;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final TourOrderService orderService;
    private final TravelRouteService routeService;
    private final TourPackageService packageService;
    private final TravelerService travelerService;
    private final OrderTravelerService orderTravelerService;
    private final TravelArrangementService arrangementService;
    private final OrderLogService logService;

    @PostMapping @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> create(@Valid @RequestBody OrderCreateRequest req) {
        TourOrder order = buildOrder(req.getRouteId(), req.getPackageId(), req.getTravelDate(), req.getPeopleCount(), req.getContactName(), req.getContactPhone(), req.getTravelerIds(), true);
        orderService.save(order);
        saveTravelers(order.getId(), req.getTravelerIds());
        log(order.getId(), "CREATE", "游客提交预订");
        return Result.ok();
    }

    @GetMapping("/my") @PreAuthorize("hasRole('TOURIST')")
    public Result<List<TourOrder>> my(){ return Result.ok(orderService.list(new LambdaQueryWrapper<TourOrder>().eq(TourOrder::getUserId, SecurityUtil.current().getId()).orderByDesc(TourOrder::getId))); }

    @GetMapping("/{id}")
    public Result<Map<String,Object>> detail(@PathVariable Long id){
        TourOrder o = orderService.getById(id); if(o==null) throw new BusinessException("订单不存在");
        if(!SecurityUtil.isAdmin() && !o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客不能操作别人的订单");
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("order", o);
        m.put("route", routeService.getById(o.getRouteId()));
        m.put("packageInfo", o.getPackageId()==null?null:packageService.getById(o.getPackageId()));
        m.put("travelers", orderTravelerService.list(new LambdaQueryWrapper<OrderTraveler>().eq(OrderTraveler::getOrderId, id)));
        m.put("arrangement", arrangementService.getOne(new LambdaQueryWrapper<TravelArrangement>().eq(TravelArrangement::getOrderId, id), false));
        return Result.ok(m);
    }

    @PutMapping("/{id}") @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody OrderUpdateRequest req) {
        TourOrder old = mustOwn(id);
        if (!List.of("PENDING_CHECK","RETURNED").contains(old.getStatus())) throw new BusinessException("只有 PENDING_CHECK 或 RETURNED 订单允许游客修改");
        TourOrder n = buildOrder(old.getRouteId(), req.getPackageId(), req.getTravelDate(), req.getPeopleCount(), req.getContactName(), req.getContactPhone(), req.getTravelerIds(), false);
        old.setPackageId(n.getPackageId()); old.setTravelDate(n.getTravelDate()); old.setPeopleCount(n.getPeopleCount()); old.setTotalAmount(n.getTotalAmount());
        old.setContactName(n.getContactName()); old.setContactPhone(n.getContactPhone()); old.setStatus("PENDING_CHECK"); old.setReturnReason(null); old.setUpdateTime(LocalDateTime.now());
        orderService.updateById(old);
        orderTravelerService.remove(new LambdaQueryWrapper<OrderTraveler>().eq(OrderTraveler::getOrderId, id));
        saveTravelers(id, req.getTravelerIds());
        log(id, "UPDATE", "游客修改订单");
        return Result.ok();
    }

    @DeleteMapping("/{id}/cancel") @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> cancel(@PathVariable Long id) {
        TourOrder o = mustOwn(id);
        if (!"PENDING_CHECK".equals(o.getStatus())) throw new BusinessException("游客只能取消 PENDING_CHECK 状态订单");
        o.setStatus("CANCELED"); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id, "CANCEL", "游客取消订单");
        return Result.ok();
    }

    @GetMapping("/{id}/arrangement")
    public Result<TravelArrangement> arrangement(@PathVariable Long id) {
        TourOrder o = orderService.getById(id);
        if(o==null) throw new BusinessException("订单不存在");
        if(!SecurityUtil.isAdmin() && !o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客不能查看别人的出行安排");
        return Result.ok(arrangementService.getOne(new LambdaQueryWrapper<TravelArrangement>().eq(TravelArrangement::getOrderId, id), false));
    }

    private TourOrder mustOwn(Long id){ TourOrder o=orderService.getById(id); if(o==null||!o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客不能操作别人的订单"); return o; }

    private TourOrder buildOrder(Long routeId, Long packageId, LocalDate date, Integer people, String name, String phone, List<Long> travelerIds, boolean createNo) {
        if(date.isBefore(LocalDate.now())) throw new BusinessException("出行日期不能早于当前日期");
        if(people == null || people <= 0) throw new BusinessException("预订人数必须大于0");
        if(travelerIds == null || travelerIds.size() != people) throw new BusinessException("订单人数必须和选择的出行人数量一致");
        TravelRoute route = routeService.getById(routeId);
        if(route == null || !"ON_SALE".equals(route.getStatus())) throw new BusinessException("线路已下架，不能预订");
        BigDecimal price = route.getPrice();
        if(packageId != null){ TourPackage p = packageService.getById(packageId); if(p==null || !p.getRouteId().equals(routeId)) throw new BusinessException("套餐必须绑定线路"); price = p.getPrice(); }
        Long userId = SecurityUtil.current().getId();
        for(Long tid: travelerIds){ Traveler t=travelerService.getById(tid); if(t==null || !t.getUserId().equals(userId)) throw new BusinessException("出行人信息错误"); }
        TourOrder order = new TourOrder();
        if(createNo) order.setOrderNo("TO" + DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS").format(LocalDateTime.now()) + (int)(Math.random()*90+10));
        order.setUserId(userId); order.setRouteId(routeId); order.setPackageId(packageId); order.setTravelDate(date); order.setPeopleCount(people);
        order.setTotalAmount(price.multiply(BigDecimal.valueOf(people))); order.setContactName(name); order.setContactPhone(phone); order.setStatus("PENDING_CHECK");
        order.setCreateTime(LocalDateTime.now()); order.setUpdateTime(LocalDateTime.now());
        return order;
    }

    private void saveTravelers(Long orderId, List<Long> ids){ for(Long id: ids){ Traveler t=travelerService.getById(id); OrderTraveler ot=new OrderTraveler(); ot.setOrderId(orderId); ot.setTravelerId(id); ot.setTravelerName(t.getName()); ot.setIdCard(t.getIdCard()); ot.setPhone(t.getPhone()); orderTravelerService.save(ot);} }
    private void log(Long orderId,String action,String remark){ OrderLog l=new OrderLog(); l.setOrderId(orderId); l.setOperatorId(SecurityUtil.current().getId()); l.setOperatorRole(SecurityUtil.current().getRole()); l.setAction(action); l.setRemark(remark); l.setCreateTime(LocalDateTime.now()); logService.save(l); }
}`);

w(`${controllerDir}/AdminOrderController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.ReturnOrderRequest;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {
    private final TourOrderService orderService; private final TravelRouteService routeService; private final SysUserService userService; private final OrderLogService logService;

    @GetMapping
    public Result<List<TourOrder>> list(LocalDate startDate, LocalDate endDate, Long routeId, String status, String phone) {
        return Result.ok(filter(startDate,endDate,routeId,status,phone));
    }

    @GetMapping("/{id}") public Result<TourOrder> detail(@PathVariable Long id){ return Result.ok(orderService.getById(id)); }

    @PutMapping("/{id}/confirm")
    public Result<Void> confirm(@PathVariable Long id){ TourOrder o=orderService.getById(id); if(o==null)throw new BusinessException("订单不存在"); if("CANCELED".equals(o.getStatus())) throw new BusinessException("已取消订单不能再次确认"); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); o.setStatus("CONFIRMED"); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id,"CONFIRM","管理员确认订单"); return Result.ok(); }

    @PutMapping("/{id}/return")
    public Result<Void> ret(@PathVariable Long id,@Valid @RequestBody ReturnOrderRequest req){ TourOrder o=orderService.getById(id); if(o==null)throw new BusinessException("订单不存在"); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); o.setStatus("RETURNED"); o.setReturnReason(req.getReason()); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id,"RETURN",req.getReason()); return Result.ok(); }

    @PutMapping("/{id}/start") public Result<Void> start(@PathVariable Long id){ change(id,"ARRANGED","TRAVELING","START","开始出行"); return Result.ok(); }
    @PutMapping("/{id}/finish") public Result<Void> finish(@PathVariable Long id){ change(id,"TRAVELING","FINISHED","FINISH","完成行程"); return Result.ok(); }
    @PutMapping("/{id}/archive") public Result<Void> archive(@PathVariable Long id){ change(id,"FINISHED","ARCHIVED","ARCHIVE","归档订单"); return Result.ok(); }

    @GetMapping("/statistics")
    public Result<Map<String,Object>> statistics(LocalDate startDate, LocalDate endDate, Long routeId, String status){
        List<TourOrder> list = filter(startDate,endDate,routeId,status,null);
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("orderCount", list.size());
        m.put("peopleCount", list.stream().mapToInt(TourOrder::getPeopleCount).sum());
        m.put("totalAmount", list.stream().map(TourOrder::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add));
        m.put("pendingCount", list.stream().filter(o -> "PENDING_CHECK".equals(o.getStatus())).count());
        m.put("todayTravelCount", list.stream().filter(o -> LocalDate.now().equals(o.getTravelDate())).count());
        return Result.ok(m);
    }

    @GetMapping("/export")
    public void export(LocalDate startDate, LocalDate endDate, Long routeId, String status, HttpServletResponse response) throws IOException {
        List<TourOrder> list = filter(startDate,endDate,routeId,status,null);
        Workbook wb = new XSSFWorkbook(); Sheet sheet = wb.createSheet("订单报表");
        String[] heads={"订单号","游客姓名","联系电话","线路名称","出行日期","人数","金额","订单状态","创建时间"};
        Row h=sheet.createRow(0); for(int i=0;i<heads.length;i++) h.createCell(i).setCellValue(heads[i]);
        int r=1; for(TourOrder o:list){ Row row=sheet.createRow(r++); SysUser u=userService.getById(o.getUserId()); TravelRoute tr=routeService.getById(o.getRouteId());
          row.createCell(0).setCellValue(o.getOrderNo()); row.createCell(1).setCellValue(u==null?"":u.getRealName()); row.createCell(2).setCellValue(o.getContactPhone());
          row.createCell(3).setCellValue(tr==null?"":tr.getRouteName()); row.createCell(4).setCellValue(String.valueOf(o.getTravelDate())); row.createCell(5).setCellValue(o.getPeopleCount());
          row.createCell(6).setCellValue(o.getTotalAmount().doubleValue()); row.createCell(7).setCellValue(o.getStatus()); row.createCell(8).setCellValue(String.valueOf(o.getCreateTime())); }
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode("orders.xlsx", StandardCharsets.UTF_8));
        wb.write(response.getOutputStream()); wb.close();
    }

    private List<TourOrder> filter(LocalDate startDate, LocalDate endDate, Long routeId, String status, String phone){
        LambdaQueryWrapper<TourOrder> qw=new LambdaQueryWrapper<>(); if(startDate!=null)qw.ge(TourOrder::getTravelDate,startDate); if(endDate!=null)qw.le(TourOrder::getTravelDate,endDate); if(routeId!=null)qw.eq(TourOrder::getRouteId,routeId); if(status!=null&&!status.isBlank())qw.eq(TourOrder::getStatus,status); qw.orderByDesc(TourOrder::getId);
        List<TourOrder> list=orderService.list(qw); if(phone!=null&&!phone.isBlank()) list=list.stream().filter(o->o.getContactPhone()!=null&&o.getContactPhone().contains(phone)).collect(Collectors.toList()); return list;
    }
    private void change(Long id,String from,String to,String action,String remark){ TourOrder o=orderService.getById(id); if(o==null)throw new BusinessException("订单不存在"); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); if(!from.equals(o.getStatus())) throw new BusinessException("状态不允许操作"); o.setStatus(to); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); log(id,action,remark); }
    private void log(Long orderId,String action,String remark){ OrderLog l=new OrderLog(); l.setOrderId(orderId); l.setOperatorId(SecurityUtil.current().getId()); l.setOperatorRole("ADMIN"); l.setAction(action); l.setRemark(remark); l.setCreateTime(LocalDateTime.now()); logService.save(l); }
}`);

w(`${controllerDir}/ArrangementController.java`, `
${pkg('controller')}

import com.example.tourism.common.Result;
import com.example.tourism.dto.ArrangementRequest;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/arrangements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ArrangementController {
    private final TravelArrangementService service; private final TourOrderService orderService;
    @PostMapping public Result<Void> add(@Valid @RequestBody ArrangementRequest req){ TourOrder o=orderService.getById(req.getOrderId()); if(o==null)throw new BusinessException("订单不存在"); if(!"CONFIRMED".equals(o.getStatus())) throw new BusinessException("只有 CONFIRMED 状态订单可以创建出行安排"); TravelArrangement a=new TravelArrangement(); a.setOrderId(req.getOrderId()); a.setGuideId(req.getGuideId()); a.setBatchNo(req.getBatchNo()); a.setDepartTime(req.getDepartTime()); a.setGatherPlace(req.getGatherPlace()); a.setReminder(req.getReminder()); a.setCreateTime(LocalDateTime.now()); service.save(a); o.setStatus("ARRANGED"); o.setUpdateTime(LocalDateTime.now()); orderService.updateById(o); return Result.ok(); }
    @PutMapping("/{id}") public Result<Void> update(@PathVariable Long id,@Valid @RequestBody ArrangementRequest req){ TravelArrangement a=service.getById(id); TourOrder o=orderService.getById(a.getOrderId()); if("ARCHIVED".equals(o.getStatus())) throw new BusinessException("已归档订单不能修改"); a.setGuideId(req.getGuideId()); a.setBatchNo(req.getBatchNo()); a.setDepartTime(req.getDepartTime()); a.setGatherPlace(req.getGatherPlace()); a.setReminder(req.getReminder()); service.updateById(a); return Result.ok(); }
}`);

w(`${controllerDir}/GuideController.java`, `
${pkg('controller')}

import com.example.tourism.common.Result;
import com.example.tourism.entity.Guide;
import com.example.tourism.service.GuideService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/guides")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GuideController {
    private final GuideService service;
    @GetMapping public Result<List<Guide>> list(){ return Result.ok(service.list()); }
    @PostMapping public Result<Void> add(@RequestBody Guide g){ if(g.getStatus()==null)g.setStatus("AVAILABLE"); service.save(g); return Result.ok(); }
    @PutMapping("/{id}") public Result<Void> update(@PathVariable Long id,@RequestBody Guide g){ g.setId(id); service.updateById(g); return Result.ok(); }
    @DeleteMapping("/{id}") public Result<Void> delete(@PathVariable Long id){ service.removeById(id); return Result.ok(); }
}`);

w(`${controllerDir}/AfterSaleController.java`, `
${pkg('controller')}

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.tourism.common.Result;
import com.example.tourism.dto.*;
import com.example.tourism.entity.*;
import com.example.tourism.exception.BusinessException;
import com.example.tourism.service.*;
import com.example.tourism.utils.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AfterSaleController {
    private final AfterSaleService service; private final TourOrderService orderService;
    @PostMapping("/api/after-sales") @PreAuthorize("hasRole('TOURIST')")
    public Result<Void> add(@Valid @RequestBody AfterSaleRequest req){ TourOrder o=orderService.getById(req.getOrderId()); if(o==null||!o.getUserId().equals(SecurityUtil.current().getId())) throw new BusinessException("游客只能对自己的订单提交售后"); AfterSale a=new AfterSale(); a.setOrderId(req.getOrderId()); a.setUserId(SecurityUtil.current().getId()); a.setType(req.getType()); a.setContent(req.getContent()); a.setStatus("PENDING"); a.setCreateTime(LocalDateTime.now()); a.setUpdateTime(LocalDateTime.now()); service.save(a); return Result.ok(); }
    @GetMapping("/api/after-sales/my") @PreAuthorize("hasRole('TOURIST')") public Result<List<AfterSale>> my(){ return Result.ok(service.list(new LambdaQueryWrapper<AfterSale>().eq(AfterSale::getUserId, SecurityUtil.current().getId()).orderByDesc(AfterSale::getId))); }
    @GetMapping("/api/admin/after-sales") @PreAuthorize("hasRole('ADMIN')") public Result<List<AfterSale>> admin(){ return Result.ok(service.list(new LambdaQueryWrapper<AfterSale>().orderByDesc(AfterSale::getId))); }
    @PutMapping("/api/admin/after-sales/{id}/reply") @PreAuthorize("hasRole('ADMIN')") public Result<Void> reply(@PathVariable Long id,@Valid @RequestBody ReplyAfterSaleRequest req){ AfterSale a=service.getById(id); a.setStatus(req.getStatus()); a.setReply(req.getReply()); a.setUpdateTime(LocalDateTime.now()); service.updateById(a); return Result.ok(); }
}`);

w('tourism-backend/src/main/resources/sql/init.sql', `
DROP DATABASE IF EXISTS tourism_system;
CREATE DATABASE tourism_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tourism_system;

CREATE TABLE sys_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  real_name VARCHAR(50),
  phone VARCHAR(30),
  email VARCHAR(80),
  role VARCHAR(20) NOT NULL,
  avatar VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE traveler (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(10),
  id_card VARCHAR(30),
  phone VARCHAR(30),
  remark VARCHAR(255),
  create_time DATETIME
);
CREATE TABLE scenic_spot (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  level VARCHAR(20),
  cover_image VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME
);
CREATE TABLE travel_route (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_name VARCHAR(120) NOT NULL,
  spot_id BIGINT NOT NULL,
  days INT,
  price DECIMAL(10,2),
  max_people INT,
  cover_image VARCHAR(255),
  itinerary TEXT,
  description TEXT,
  status VARCHAR(20) DEFAULT 'ON_SALE',
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE tour_package (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id BIGINT NOT NULL,
  package_name VARCHAR(100) NOT NULL,
  package_type VARCHAR(50),
  price DECIMAL(10,2),
  include_service TEXT,
  exclude_service TEXT,
  status VARCHAR(20) DEFAULT 'ENABLE',
  create_time DATETIME
);
CREATE TABLE tour_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL,
  route_id BIGINT NOT NULL,
  package_id BIGINT,
  travel_date DATE,
  people_count INT,
  total_amount DECIMAL(10,2),
  contact_name VARCHAR(50),
  contact_phone VARCHAR(30),
  status VARCHAR(30),
  return_reason VARCHAR(255),
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE order_traveler (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  traveler_id BIGINT,
  traveler_name VARCHAR(50),
  id_card VARCHAR(30),
  phone VARCHAR(30)
);
CREATE TABLE guide (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(30),
  level VARCHAR(30),
  status VARCHAR(20)
);
CREATE TABLE travel_arrangement (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL UNIQUE,
  guide_id BIGINT,
  batch_no VARCHAR(50),
  depart_time DATETIME,
  gather_place VARCHAR(255),
  reminder TEXT,
  create_time DATETIME
);
CREATE TABLE after_sale (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  type VARCHAR(30),
  content TEXT,
  status VARCHAR(30),
  reply TEXT,
  create_time DATETIME,
  update_time DATETIME
);
CREATE TABLE order_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  operator_id BIGINT,
  operator_role VARCHAR(20),
  action VARCHAR(50),
  remark VARCHAR(255),
  create_time DATETIME
);

SET @pwd = '$2b$12$OmbHsVJF/U.dwEuahVQqMeFpcDGZeKrV5eb/nHzrUih6/eU0nFvjC';
INSERT INTO sys_user(username,password,real_name,phone,email,role,status,create_time,update_time) VALUES
('admin',@pwd,'平台管理员','13800000000','admin@example.com','ADMIN','ENABLE',NOW(),NOW()),
('tourist1',@pwd,'游客一号','13900000001','tourist1@example.com','TOURIST','ENABLE',NOW(),NOW()),
('tourist2',@pwd,'游客二号','13900000002','tourist2@example.com','TOURIST','ENABLE',NOW(),NOW());

INSERT INTO traveler(user_id,name,gender,id_card,phone,remark,create_time) VALUES
(2,'张三','男','110101199001011234','13900000001','本人',NOW()),
(2,'李四','女','110101199202021235','13900000003','同行人',NOW()),
(3,'王五','男','110101199303031236','13900000002','本人',NOW()),
(3,'赵六','女','110101199404041237','13900000004','朋友',NOW());

INSERT INTO scenic_spot(name,location,level,cover_image,description,status,create_time) VALUES
('西湖','浙江杭州','5A','https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b','湖光山色与人文古迹结合的经典景区。','ENABLE',NOW()),
('黄山','安徽黄山','5A','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','以奇松、怪石、云海、温泉闻名。','ENABLE',NOW()),
('张家界','湖南张家界','5A','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429','峰林地貌与玻璃栈道体验。','ENABLE',NOW()),
('鼓浪屿','福建厦门','5A','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2','海岛风情、建筑街巷与音乐文化。','ENABLE',NOW()),
('丽江古城','云南丽江','5A','https://images.unsplash.com/photo-1507525428034-b723cf961d3e','古城民俗、雪山远眺与慢旅行。','ENABLE',NOW());

INSERT INTO travel_route(route_name,spot_id,days,price,max_people,cover_image,itinerary,description,status,create_time,update_time) VALUES
('杭州西湖二日休闲游',1,2,699,30,'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b','D1 断桥-苏堤-雷峰塔；D2 灵隐寺-龙井村','适合周末短途休闲。','ON_SALE',NOW(),NOW()),
('黄山三日摄影游',2,3,1299,25,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','D1 抵达屯溪；D2 黄山云海；D3 宏村返程','适合摄影和登山爱好者。','ON_SALE',NOW(),NOW()),
('张家界四日深度游',3,4,1899,28,'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429','D1 森林公园；D2 袁家界；D3 天门山；D4 返程','峰林地貌深度体验。','ON_SALE',NOW(),NOW()),
('厦门鼓浪屿三日亲子游',4,3,1599,20,'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2','D1 环岛路；D2 鼓浪屿；D3 集美学村','亲子慢游路线。','ON_SALE',NOW(),NOW()),
('丽江雪山五日游',5,5,2699,22,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e','D1 古城；D2 玉龙雪山；D3 束河；D4 泸沽湖；D5 返程','云南经典人文自然路线。','ON_SALE',NOW(),NOW());

INSERT INTO tour_package(route_id,package_name,package_type,price,include_service,exclude_service,status,create_time) VALUES
(1,'经济套餐','ECONOMY',699,'交通、门票、经济酒店','个人消费','ENABLE',NOW()),(1,'舒适套餐','COMFORT',899,'交通、门票、四星酒店、早餐','个人消费','ENABLE',NOW()),
(2,'基础套餐','ECONOMY',1299,'交通、门票、山下住宿','索道自费','ENABLE',NOW()),(2,'摄影套餐','THEME',1699,'交通、门票、摄影向导、精选住宿','个人器材','ENABLE',NOW()),
(3,'标准套餐','STANDARD',1899,'交通、门票、酒店','个人消费','ENABLE',NOW()),(3,'精品小团','BOUTIQUE',2399,'精品小团、特色餐、优先入园','个人消费','ENABLE',NOW()),
(4,'亲子基础','FAMILY',1599,'交通、门票、亲子酒店','个人消费','ENABLE',NOW()),(4,'亲子舒适','FAMILY_PLUS',1999,'亲子酒店、特色体验、早餐','个人消费','ENABLE',NOW()),
(5,'标准套餐','STANDARD',2699,'交通、酒店、门票','个人消费','ENABLE',NOW()),(5,'轻奢套餐','LUXURY',3399,'高端酒店、专车、特色餐','个人消费','ENABLE',NOW());

INSERT INTO guide(name,phone,level,status) VALUES
('陈导','13700000001','高级','AVAILABLE'),('刘导','13700000002','中级','AVAILABLE'),('周导','13700000003','高级','AVAILABLE');

INSERT INTO tour_order(order_no,user_id,route_id,package_id,travel_date,people_count,total_amount,contact_name,contact_phone,status,return_reason,create_time,update_time) VALUES
('TO202606220001',2,1,1,'2026-07-01',1,699,'张三','13900000001','PENDING_CHECK',NULL,NOW(),NOW()),
('TO202606220002',2,2,3,'2026-07-05',2,2598,'张三','13900000001','RETURNED','身份证信息需要核对',NOW(),NOW()),
('TO202606220003',3,3,5,'2026-07-08',1,1899,'王五','13900000002','CONFIRMED',NULL,NOW(),NOW()),
('TO202606220004',3,4,7,'2026-07-10',2,3198,'王五','13900000002','ARRANGED',NULL,NOW(),NOW()),
('TO202606220005',2,5,9,'2026-06-20',1,2699,'张三','13900000001','FINISHED',NULL,NOW(),NOW());
INSERT INTO order_traveler(order_id,traveler_id,traveler_name,id_card,phone) VALUES
(1,1,'张三','110101199001011234','13900000001'),(2,1,'张三','110101199001011234','13900000001'),(2,2,'李四','110101199202021235','13900000003'),
(3,3,'王五','110101199303031236','13900000002'),(4,3,'王五','110101199303031236','13900000002'),(4,4,'赵六','110101199404041237','13900000004'),(5,1,'张三','110101199001011234','13900000001');
INSERT INTO travel_arrangement(order_id,guide_id,batch_no,depart_time,gather_place,reminder,create_time) VALUES
(4,1,'XM-20260710-A','2026-07-10 08:00:00','厦门北站南广场','请携带身份证，提前 30 分钟集合。',NOW());
INSERT INTO after_sale(order_id,user_id,type,content,status,reply,create_time,update_time) VALUES
(5,2,'CONSULT','行程结束后发票如何开具？','DONE','请在个人中心补充发票抬头后联系客服开具。',NOW(),NOW());
INSERT INTO order_log(order_id,operator_id,operator_role,action,remark,create_time) VALUES
(1,2,'TOURIST','CREATE','游客提交预订',NOW()),(3,1,'ADMIN','CONFIRM','管理员确认订单',NOW()),(4,1,'ADMIN','ARRANGE','管理员分配导游和批次',NOW());
`);

w('tourism-backend/README.md', `
# tourism-backend

Spring Boot 3 + MyBatis Plus + MySQL + JWT 后端。

1. 先执行 \`src/main/resources/sql/init.sql\` 初始化 MySQL 8 数据库。
2. 修改 \`src/main/resources/application.yml\` 中 MySQL 用户名密码。
3. 使用项目根目录 \`start.ps1\` 一键启动，或在本目录运行 \`mvn spring-boot:run\`。
`);

// Frontend
w('tourism-frontend/package.json', `
{"scripts":{"dev":"vite --host 0.0.0.0 --port 5173","build":"vite build","preview":"vite preview --host 0.0.0.0"},"dependencies":{"@element-plus/icons-vue":"latest","@vitejs/plugin-vue":"latest","axios":"latest","element-plus":"latest","pinia":"latest","vite":"latest","vue":"latest","vue-router":"latest"},"devDependencies":{}}
`);
w('tourism-frontend/index.html', `<div id="app"></div><script type="module" src="/src/main.js"></script>`);
w('tourism-frontend/vite.config.js', `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ plugins: [vue()], server: { proxy: { '/api': 'http://localhost:8080' } } })
`);
w('tourism-frontend/src/main.js', `
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './styles.css'

const app = createApp(App)
Object.entries(Icons).forEach(([k,v]) => app.component(k,v))
app.use(createPinia()).use(router).use(ElementPlus).mount('#app')
`);
w('tourism-frontend/src/App.vue', `<template><router-view /></template>`);
w('tourism-frontend/src/styles.css', `
body{margin:0;background:#f5f7fb;color:#1f2937;font-family:Arial,"Microsoft YaHei",sans-serif}a{color:inherit;text-decoration:none}.page{padding:20px}.toolbar{display:flex;gap:12px;align-items:center;margin-bottom:14px;flex-wrap:wrap}.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}.cover{width:100%;height:150px;object-fit:cover;border-radius:6px}.muted{color:#6b7280}.price{color:#e85d04;font-weight:700}.form{max-width:720px}.layout-top{height:58px;background:white;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 22px}.brand{font-weight:700;font-size:18px}.main{max-width:1180px;margin:0 auto}.admin-shell{height:100vh;display:flex}.admin-side{width:220px;background:#1f2937;color:white}.admin-logo{height:56px;display:flex;align-items:center;padding-left:18px;font-weight:700}.admin-main{flex:1;display:flex;flex-direction:column;overflow:hidden}.admin-top{height:56px;background:white;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 18px}.admin-content{overflow:auto;padding:18px}.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px}.stat-card{background:white;border-radius:8px;padding:18px}.stat-number{font-size:28px;font-weight:700;margin-top:8px}
`);
w('tourism-frontend/src/utils/request.js', `
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
const request = axios.create({ baseURL: '', timeout: 15000 })
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})
request.interceptors.response.use(res => {
  const data = res.data
  if (data && data.code && data.code !== 200) {
    ElMessage.error(data.message || '请求失败')
    if (data.code === 401) router.push('/login')
    return Promise.reject(data)
  }
  return data?.data ?? data
}, err => {
  if (err.response?.status === 401) { localStorage.clear(); router.push('/login') }
  ElMessage.error(err.response?.data?.message || err.message || '请求失败')
  return Promise.reject(err)
})
export default request
`);
w('tourism-frontend/src/store/user.js', `
import { defineStore } from 'pinia'
import request from '../utils/request'
export const useUserStore = defineStore('user', {
  state: () => ({ token: localStorage.getItem('token') || '', user: JSON.parse(localStorage.getItem('user') || 'null') }),
  getters: { role: s => s.user?.role, isAdmin: s => s.user?.role === 'ADMIN', isTourist: s => s.user?.role === 'TOURIST' },
  actions: {
    async login(form) { const data = await request.post('/api/auth/login', form); this.token = data.token; this.user = data.user; localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); return data },
    logout() { this.token=''; this.user=null; localStorage.clear() }
  }
})
`);
w('tourism-frontend/src/router/index.js', `
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'
import TouristLayout from '../layout/TouristLayout.vue'
import AdminLayout from '../layout/AdminLayout.vue'
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/', component: TouristLayout, children: [
    { path: 'home', component: () => import('../views/Home.vue') },
    { path: 'spots', component: () => import('../views/Spots.vue') },
    { path: 'routes', component: () => import('../views/Routes.vue') },
    { path: 'routes/:id', component: () => import('../views/RouteDetail.vue') },
    { path: 'booking/:routeId', meta:{role:'TOURIST'}, component: () => import('../views/Booking.vue') },
    { path: 'my/orders', meta:{role:'TOURIST'}, component: () => import('../views/my/MyOrders.vue') },
    { path: 'my/orders/:id', meta:{role:'TOURIST'}, component: () => import('../views/my/OrderDetail.vue') },
    { path: 'my/travelers', meta:{role:'TOURIST'}, component: () => import('../views/my/Travelers.vue') },
    { path: 'my/profile', meta:{role:'TOURIST'}, component: () => import('../views/my/Profile.vue') },
    { path: 'my/after-sales', meta:{role:'TOURIST'}, component: () => import('../views/my/AfterSales.vue') }
  ]},
  { path: '/admin', component: AdminLayout, meta:{role:'ADMIN'}, children: [
    { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue') },
    { path: 'spots', component: () => import('../views/admin/AdminSpots.vue') },
    { path: 'routes', component: () => import('../views/admin/AdminRoutes.vue') },
    { path: 'packages', component: () => import('../views/admin/AdminPackages.vue') },
    { path: 'guides', component: () => import('../views/admin/Guides.vue') },
    { path: 'orders', component: () => import('../views/admin/AdminOrders.vue') },
    { path: 'arrangements', component: () => import('../views/admin/Arrangements.vue') },
    { path: 'after-sales', component: () => import('../views/admin/AdminAfterSales.vue') },
    { path: 'reports', component: () => import('../views/admin/Reports.vue') }
  ]}
]
const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to) => {
  const store = useUserStore()
  const need = to.matched.find(r => r.meta.role)?.meta.role || to.meta.role
  if (need && !store.token) return '/login'
  if (need && store.role !== need) return store.role === 'ADMIN' ? '/admin/dashboard' : '/home'
})
export default router
`);

w('tourism-frontend/src/api/modules.js', `
import request from '../utils/request'
export const authApi = { login:d=>request.post('/api/auth/login',d), register:d=>request.post('/api/auth/register',d) }
export const userApi = { profile:()=>request.get('/api/user/profile'), update:d=>request.put('/api/user/profile',d), password:d=>request.put('/api/user/password',d) }
export const spotApi = { list:p=>request.get('/api/spots',{params:p}), detail:id=>request.get('/api/spots/'+id), add:d=>request.post('/api/admin/spots',d), update:(id,d)=>request.put('/api/admin/spots/'+id,d), del:id=>request.delete('/api/admin/spots/'+id), status:(id,status)=>request.put('/api/admin/spots/'+id+'/status',null,{params:{status}}) }
export const routeApi = { list:p=>request.get('/api/routes',{params:p}), detail:id=>request.get('/api/routes/'+id), add:d=>request.post('/api/admin/routes',d), update:(id,d)=>request.put('/api/admin/routes/'+id,d), del:id=>request.delete('/api/admin/routes/'+id), on:id=>request.put('/api/admin/routes/'+id+'/on-sale'), off:id=>request.put('/api/admin/routes/'+id+'/off-sale') }
export const packageApi = { list:p=>request.get('/api/packages',{params:p}), add:d=>request.post('/api/admin/packages',d), update:(id,d)=>request.put('/api/admin/packages/'+id,d), del:id=>request.delete('/api/admin/packages/'+id) }
export const travelerApi = { list:()=>request.get('/api/travelers'), add:d=>request.post('/api/travelers',d), update:(id,d)=>request.put('/api/travelers/'+id,d), del:id=>request.delete('/api/travelers/'+id) }
export const orderApi = { create:d=>request.post('/api/orders',d), my:()=>request.get('/api/orders/my'), detail:id=>request.get('/api/orders/'+id), update:(id,d)=>request.put('/api/orders/'+id,d), cancel:id=>request.delete('/api/orders/'+id+'/cancel'), arrangement:id=>request.get('/api/orders/'+id+'/arrangement') }
export const adminOrderApi = { list:p=>request.get('/api/admin/orders',{params:p}), detail:id=>request.get('/api/admin/orders/'+id), confirm:id=>request.put('/api/admin/orders/'+id+'/confirm'), ret:(id,reason)=>request.put('/api/admin/orders/'+id+'/return',{reason}), start:id=>request.put('/api/admin/orders/'+id+'/start'), finish:id=>request.put('/api/admin/orders/'+id+'/finish'), archive:id=>request.put('/api/admin/orders/'+id+'/archive'), stat:p=>request.get('/api/admin/orders/statistics',{params:p}), exportUrl:p=>'/api/admin/orders/export?'+new URLSearchParams(p||{}).toString() }
export const guideApi = { list:()=>request.get('/api/admin/guides'), add:d=>request.post('/api/admin/guides',d), update:(id,d)=>request.put('/api/admin/guides/'+id,d), del:id=>request.delete('/api/admin/guides/'+id) }
export const arrangementApi = { add:d=>request.post('/api/admin/arrangements',d), update:(id,d)=>request.put('/api/admin/arrangements/'+id,d) }
export const afterSaleApi = { add:d=>request.post('/api/after-sales',d), my:()=>request.get('/api/after-sales/my'), admin:()=>request.get('/api/admin/after-sales'), reply:(id,d)=>request.put('/api/admin/after-sales/'+id+'/reply',d) }
`);

w('tourism-frontend/src/components/StatusTag.vue', `
<template><el-tag :type="map[value] || 'info'">{{ label[value] || value }}</el-tag></template>
<script setup>
defineProps({ value:String })
const map={PENDING_CHECK:'warning',RETURNED:'danger',CONFIRMED:'success',ARRANGED:'primary',TRAVELING:'',FINISHED:'info',CANCELED:'danger',ARCHIVED:'info',ON_SALE:'success',OFF_SALE:'info',ENABLE:'success',DISABLE:'info',PENDING:'warning',PROCESSING:'primary',DONE:'success',REJECTED:'danger'}
const label={PENDING_CHECK:'待核对',RETURNED:'已退回',CONFIRMED:'已确认',ARRANGED:'已安排',TRAVELING:'出行中',FINISHED:'已完成',CANCELED:'已取消',ARCHIVED:'已归档',ON_SALE:'上架',OFF_SALE:'下架',ENABLE:'启用',DISABLE:'停用',PENDING:'待处理',PROCESSING:'处理中',DONE:'已完成',REJECTED:'已拒绝'}
</script>
`);

w('tourism-frontend/src/layout/TouristLayout.vue', `
<template>
  <div>
    <div class="layout-top"><div class="brand">旅游管理系统</div><el-menu mode="horizontal" router :ellipsis="false">
      <el-menu-item index="/home">首页</el-menu-item><el-menu-item index="/spots">景点</el-menu-item><el-menu-item index="/routes">线路</el-menu-item>
      <el-menu-item v-if="store.isTourist" index="/my/orders">我的订单</el-menu-item><el-menu-item v-if="store.isTourist" index="/my/travelers">出行人</el-menu-item><el-menu-item v-if="store.isTourist" index="/my/after-sales">售后</el-menu-item><el-menu-item v-if="store.isTourist" index="/my/profile">个人中心</el-menu-item>
    </el-menu><div><el-button v-if="!store.token" type="primary" @click="$router.push('/login')">登录</el-button><el-button v-else @click="logout">退出</el-button></div></div>
    <main class="main"><router-view /></main>
  </div>
</template><script setup>
import { useUserStore } from '../store/user'
const store=useUserStore(); function logout(){store.logout(); location.href='/login'}
</script>
`);
w('tourism-frontend/src/layout/AdminLayout.vue', `
<template><div class="admin-shell"><aside class="admin-side"><div class="admin-logo">旅游后台</div><el-menu router background-color="#1f2937" text-color="#d1d5db" active-text-color="#fff">
<el-menu-item index="/admin/dashboard">首页仪表盘</el-menu-item><el-menu-item index="/admin/spots">景点管理</el-menu-item><el-menu-item index="/admin/routes">线路管理</el-menu-item><el-menu-item index="/admin/packages">套餐管理</el-menu-item><el-menu-item index="/admin/guides">导游管理</el-menu-item><el-menu-item index="/admin/orders">订单核对</el-menu-item><el-menu-item index="/admin/arrangements">出行安排</el-menu-item><el-menu-item index="/admin/after-sales">售后管理</el-menu-item><el-menu-item index="/admin/reports">统计报表</el-menu-item></el-menu></aside>
<section class="admin-main"><div class="admin-top"><span>后台管理</span><el-button @click="logout">退出登录</el-button></div><div class="admin-content"><router-view /></div></section></div></template>
<script setup>import { useUserStore } from '../store/user'; const store=useUserStore(); function logout(){store.logout(); location.href='/login'}</script>
`);

w('tourism-frontend/src/views/Login.vue', `
<template><div class="page" style="max-width:420px;margin:8vh auto"><el-card><h2>登录</h2><el-form :model="form" @keyup.enter="submit"><el-form-item><el-input v-model="form.username" placeholder="用户名" /></el-form-item><el-form-item><el-input v-model="form.password" type="password" show-password placeholder="密码" /></el-form-item><el-button type="primary" style="width:100%" @click="submit">登录</el-button><el-button link @click="$router.push('/register')">注册游客账号</el-button></el-form></el-card></div></template>
<script setup>import { reactive } from 'vue'; import { useRouter } from 'vue-router'; import { useUserStore } from '../store/user'; const form=reactive({username:'admin',password:'123456'}); const router=useRouter(); const store=useUserStore(); async function submit(){const d=await store.login(form); router.push(d.role==='ADMIN'?'/admin/dashboard':'/home')}</script>
`);
w('tourism-frontend/src/views/Register.vue', `
<template><div class="page" style="max-width:520px;margin:5vh auto"><el-card><h2>游客注册</h2><el-form :model="form" label-width="80px"><el-form-item label="用户名"><el-input v-model="form.username"/></el-form-item><el-form-item label="密码"><el-input v-model="form.password" type="password"/></el-form-item><el-form-item label="姓名"><el-input v-model="form.realName"/></el-form-item><el-form-item label="手机"><el-input v-model="form.phone"/></el-form-item><el-form-item label="邮箱"><el-input v-model="form.email"/></el-form-item><el-button type="primary" @click="submit">注册</el-button><el-button @click="$router.push('/login')">返回登录</el-button></el-form></el-card></div></template>
<script setup>import { reactive } from 'vue'; import { ElMessage } from 'element-plus'; import { authApi } from '../api/modules'; import { useRouter } from 'vue-router'; const router=useRouter(); const form=reactive({}); async function submit(){await authApi.register(form); ElMessage.success('注册成功'); router.push('/login')}</script>
`);
w('tourism-frontend/src/views/Home.vue', `
<template><div class="page"><h2>推荐线路</h2><div class="card-grid"><el-card v-for="r in routes" :key="r.id"><img class="cover" :src="r.coverImage"><h3>{{r.routeName}}</h3><p class="muted">{{r.description}}</p><p><span class="price">￥{{r.price}}</span> / {{r.days}}天</p><el-button type="primary" @click="$router.push('/routes/'+r.id)">查看详情</el-button></el-card></div><h2>推荐景点</h2><div class="card-grid"><el-card v-for="s in spots" :key="s.id"><img class="cover" :src="s.coverImage"><h3>{{s.name}}</h3><p>{{s.location}} · {{s.level}}</p><p class="muted">{{s.description}}</p></el-card></div></div></template>
<script setup>import { ref,onMounted } from 'vue'; import { routeApi,spotApi } from '../api/modules'; const routes=ref([]),spots=ref([]); onMounted(async()=>{routes.value=(await routeApi.list({size:6})).records; spots.value=(await spotApi.list({size:6})).records})</script>
`);
w('tourism-frontend/src/views/Spots.vue', `
<template><div class="page"><div class="toolbar"><el-input v-model="q.name" placeholder="景点名称" style="width:220px"/><el-input v-model="q.location" placeholder="地区" style="width:180px"/><el-button type="primary" @click="load">查询</el-button></div><div class="card-grid"><el-card v-for="s in list" :key="s.id"><img class="cover" :src="s.coverImage"><h3>{{s.name}}</h3><p>{{s.location}} · {{s.level}}</p><p class="muted">{{s.description}}</p></el-card></div><el-pagination layout="prev,pager,next,total" :total="total" v-model:current-page="q.page" :page-size="q.size" @current-change="load"/></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { spotApi } from '../api/modules'; const q=reactive({page:1,size:8}); const list=ref([]),total=ref(0); async function load(){const p=await spotApi.list(q); list.value=p.records; total.value=p.total} onMounted(load)</script>
`);
w('tourism-frontend/src/views/Routes.vue', `
<template><div class="page"><div class="toolbar"><el-input v-model="q.keyword" placeholder="线路关键字" style="width:220px"/><el-input-number v-model="q.days" placeholder="天数"/><el-input-number v-model="q.minPrice" placeholder="最低价"/><el-input-number v-model="q.maxPrice" placeholder="最高价"/><el-button type="primary" @click="load">查询</el-button></div><div class="card-grid"><el-card v-for="r in list" :key="r.id"><img class="cover" :src="r.coverImage"><h3>{{r.routeName}}</h3><p class="muted">{{r.description}}</p><p><span class="price">￥{{r.price}}</span> / {{r.days}}天</p><el-button type="primary" @click="$router.push('/routes/'+r.id)">详情</el-button></el-card></div><el-pagination layout="prev,pager,next,total" :total="total" v-model:current-page="q.page" :page-size="q.size" @current-change="load"/></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { routeApi } from '../api/modules'; const q=reactive({page:1,size:8}); const list=ref([]),total=ref(0); async function load(){const p=await routeApi.list(q); list.value=p.records; total.value=p.total} onMounted(load)</script>
`);
w('tourism-frontend/src/views/RouteDetail.vue', `
<template><div class="page" v-if="route"><el-card><img class="cover" style="height:260px" :src="route.coverImage"><h2>{{route.routeName}}</h2><p><span class="price">￥{{route.price}}</span> · {{route.days}}天 · 最多{{route.maxPeople}}人</p><p>{{route.description}}</p><el-divider/><h3>行程安排</h3><p style="white-space:pre-wrap">{{route.itinerary}}</p><h3>套餐</h3><el-radio-group v-model="pkg"><el-radio-button v-for="p in packages" :label="p.id" :key="p.id">{{p.packageName}} ￥{{p.price}}</el-radio-button></el-radio-group><div style="margin-top:18px"><el-button type="primary" @click="$router.push('/booking/'+route.id+'?packageId='+pkg)">立即预订</el-button></div></el-card></div></template>
<script setup>import { ref,onMounted } from 'vue'; import { useRoute } from 'vue-router'; import { routeApi } from '../api/modules'; const route=ref(null),packages=ref([]),pkg=ref(); const r=useRoute(); onMounted(async()=>{const d=await routeApi.detail(r.params.id); route.value=d.route; packages.value=d.packages; pkg.value=packages.value[0]?.id})</script>
`);
w('tourism-frontend/src/views/Booking.vue', `
<template><div class="page"><el-card><h2>提交预订</h2><el-form :model="form" label-width="100px" class="form"><el-form-item label="套餐"><el-select v-model="form.packageId"><el-option v-for="p in packages" :key="p.id" :label="p.packageName+' ￥'+p.price" :value="p.id"/></el-select></el-form-item><el-form-item label="出行日期"><el-date-picker v-model="form.travelDate" value-format="YYYY-MM-DD"/></el-form-item><el-form-item label="人数"><el-input-number v-model="form.peopleCount" :min="1"/></el-form-item><el-form-item label="联系人"><el-input v-model="form.contactName"/></el-form-item><el-form-item label="联系电话"><el-input v-model="form.contactPhone"/></el-form-item><el-form-item label="出行人"><el-checkbox-group v-model="form.travelerIds"><el-checkbox v-for="t in travelers" :key="t.id" :label="t.id">{{t.name}}</el-checkbox></el-checkbox-group></el-form-item><el-button type="primary" @click="submit">提交订单</el-button><el-button @click="$router.push('/my/travelers')">维护出行人</el-button></el-form></el-card></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { useRoute,useRouter } from 'vue-router'; import { ElMessage } from 'element-plus'; import { routeApi,travelerApi,orderApi } from '../api/modules'; const r=useRoute(),router=useRouter(); const form=reactive({routeId:Number(r.params.routeId),packageId:Number(r.query.packageId)||undefined,peopleCount:1,travelerIds:[]}); const packages=ref([]),travelers=ref([]); onMounted(async()=>{packages.value=(await routeApi.detail(r.params.routeId)).packages; travelers.value=await travelerApi.list()}); async function submit(){await orderApi.create(form); ElMessage.success('预订成功'); router.push('/my/orders')}</script>
`);

// My pages
w('tourism-frontend/src/views/my/MyOrders.vue', `
<template><div class="page"><el-card><h2>我的订单</h2><el-table :data="list"><el-table-column prop="orderNo" label="订单号"/><el-table-column prop="travelDate" label="出行日期"/><el-table-column prop="peopleCount" label="人数"/><el-table-column prop="totalAmount" label="金额"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column><el-table-column label="操作" width="220"><template #default="{row}"><el-button link @click="$router.push('/my/orders/'+row.id)">详情</el-button><el-button link type="danger" v-if="row.status==='PENDING_CHECK'" @click="cancel(row.id)">取消</el-button></template></el-table-column></el-table></el-card></div></template>
<script setup>import { ref,onMounted } from 'vue'; import { ElMessage,ElMessageBox } from 'element-plus'; import { orderApi } from '../../api/modules'; import StatusTag from '../../components/StatusTag.vue'; const list=ref([]); async function load(){list.value=await orderApi.my()} async function cancel(id){await ElMessageBox.confirm('确认取消订单？'); await orderApi.cancel(id); ElMessage.success('已取消'); load()} onMounted(load)</script>
`);
w('tourism-frontend/src/views/my/OrderDetail.vue', `
<template><div class="page" v-if="data.order"><el-card><h2>订单详情 <StatusTag :value="data.order.status"/></h2><p>订单号：{{data.order.orderNo}}　线路：{{data.route?.routeName}}　金额：￥{{data.order.totalAmount}}</p><p>出行日期：{{data.order.travelDate}}　人数：{{data.order.peopleCount}}　联系人：{{data.order.contactName}} {{data.order.contactPhone}}</p><p v-if="data.order.returnReason">退回原因：{{data.order.returnReason}}</p><el-divider/><h3>出行人</h3><el-table :data="data.travelers"><el-table-column prop="travelerName" label="姓名"/><el-table-column prop="idCard" label="身份证"/><el-table-column prop="phone" label="手机"/></el-table><h3>出行安排</h3><el-empty v-if="!data.arrangement" description="暂无安排"/><p v-else>批次：{{data.arrangement.batchNo}}　出发：{{data.arrangement.departTime}}　集合：{{data.arrangement.gatherPlace}}　提醒：{{data.arrangement.reminder}}</p></el-card></div></template>
<script setup>import { reactive,onMounted } from 'vue'; import { useRoute } from 'vue-router'; import { orderApi } from '../../api/modules'; import StatusTag from '../../components/StatusTag.vue'; const r=useRoute(); const data=reactive({}); onMounted(async()=>Object.assign(data, await orderApi.detail(r.params.id)))</script>
`);
w('tourism-frontend/src/views/my/Travelers.vue', `
<template><div class="page"><el-card><div class="toolbar"><h2>常用出行人</h2><el-button type="primary" @click="open({})">新增</el-button></div><el-table :data="list"><el-table-column prop="name" label="姓名"/><el-table-column prop="gender" label="性别"/><el-table-column prop="idCard" label="身份证"/><el-table-column prop="phone" label="手机"/><el-table-column label="操作"><template #default="{row}"><el-button link @click="open(row)">编辑</el-button><el-button link type="danger" @click="del(row.id)">删除</el-button></template></el-table-column></el-table></el-card><el-dialog v-model="show" title="出行人"><el-form :model="form" label-width="80px"><el-form-item label="姓名"><el-input v-model="form.name"/></el-form-item><el-form-item label="性别"><el-select v-model="form.gender"><el-option label="男" value="男"/><el-option label="女" value="女"/></el-select></el-form-item><el-form-item label="身份证"><el-input v-model="form.idCard"/></el-form-item><el-form-item label="手机"><el-input v-model="form.phone"/></el-form-item><el-form-item label="备注"><el-input v-model="form.remark"/></el-form-item></el-form><template #footer><el-button @click="show=false">取消</el-button><el-button type="primary" @click="save">保存</el-button></template></el-dialog></div></template>
<script setup>import { ref,reactive,onMounted } from 'vue'; import { ElMessage,ElMessageBox } from 'element-plus'; import { travelerApi } from '../../api/modules'; const list=ref([]),show=ref(false),form=reactive({}); async function load(){list.value=await travelerApi.list()} function open(row){Object.assign(form,row); show.value=true} async function save(){form.id?await travelerApi.update(form.id,form):await travelerApi.add(form); ElMessage.success('保存成功'); show.value=false; load()} async function del(id){await ElMessageBox.confirm('确认删除？'); await travelerApi.del(id); load()} onMounted(load)</script>
`);
w('tourism-frontend/src/views/my/Profile.vue', `
<template><div class="page"><el-card><h2>个人中心</h2><el-form :model="form" label-width="80px" class="form"><el-form-item label="姓名"><el-input v-model="form.realName"/></el-form-item><el-form-item label="手机"><el-input v-model="form.phone"/></el-form-item><el-form-item label="邮箱"><el-input v-model="form.email"/></el-form-item><el-button type="primary" @click="save">保存资料</el-button></el-form><el-divider/><el-form :model="pwd" label-width="80px" class="form"><el-form-item label="旧密码"><el-input type="password" v-model="pwd.oldPassword"/></el-form-item><el-form-item label="新密码"><el-input type="password" v-model="pwd.newPassword"/></el-form-item><el-button @click="change">修改密码</el-button></el-form></el-card></div></template>
<script setup>import { reactive,onMounted } from 'vue'; import { ElMessage } from 'element-plus'; import { userApi } from '../../api/modules'; const form=reactive({}),pwd=reactive({}); onMounted(async()=>Object.assign(form, await userApi.profile())); async function save(){await userApi.update(form); ElMessage.success('已保存')} async function change(){await userApi.password(pwd); ElMessage.success('密码已修改')}</script>
`);
w('tourism-frontend/src/views/my/AfterSales.vue', `
<template><div class="page"><el-card><h2>售后申请</h2><el-form :model="form" inline><el-form-item label="订单"><el-select v-model="form.orderId" style="width:220px"><el-option v-for="o in orders" :key="o.id" :label="o.orderNo" :value="o.id"/></el-select></el-form-item><el-form-item label="类型"><el-select v-model="form.type"><el-option label="改签" value="CHANGE_DATE"/><el-option label="咨询" value="CONSULT"/><el-option label="退款" value="REFUND"/><el-option label="其他" value="OTHER"/></el-select></el-form-item><el-form-item label="内容"><el-input v-model="form.content" style="width:300px"/></el-form-item><el-button type="primary" @click="submit">提交</el-button></el-form><el-table :data="list"><el-table-column prop="orderId" label="订单ID"/><el-table-column prop="type" label="类型"/><el-table-column prop="content" label="内容"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column><el-table-column prop="reply" label="回复"/></el-table></el-card></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { ElMessage } from 'element-plus'; import { afterSaleApi,orderApi } from '../../api/modules'; import StatusTag from '../../components/StatusTag.vue'; const form=reactive({type:'CONSULT'}),list=ref([]),orders=ref([]); async function load(){list.value=await afterSaleApi.my(); orders.value=await orderApi.my()} async function submit(){await afterSaleApi.add(form); ElMessage.success('已提交'); load()} onMounted(load)</script>
`);

// Admin views
w('tourism-frontend/src/views/admin/Dashboard.vue', `
<template><div><div class="stat-row"><div class="stat-card"><div>订单总数</div><div class="stat-number">{{s.orderCount||0}}</div></div><div class="stat-card"><div>待核对</div><div class="stat-number">{{s.pendingCount||0}}</div></div><div class="stat-card"><div>今日出行</div><div class="stat-number">{{s.todayTravelCount||0}}</div></div><div class="stat-card"><div>总销售额</div><div class="stat-number">￥{{s.totalAmount||0}}</div></div></div></div></template>
<script setup>import { reactive,onMounted } from 'vue'; import { adminOrderApi } from '../../api/modules'; const s=reactive({}); onMounted(async()=>Object.assign(s, await adminOrderApi.stat({})))</script>
`);

function adminCrudView(name, title, columns, apiName, formFields, extra = '') {
  w(`tourism-frontend/src/views/admin/${name}.vue`, `
<template><div><el-card><div class="toolbar"><h2>${title}</h2><el-input v-model="q.keyword" placeholder="关键字" style="width:200px"/><el-button type="primary" @click="load">查询</el-button><el-button type="success" @click="open({})">新增</el-button></div><el-table :data="list">${columns}<el-table-column label="操作" width="220"><template #default="{row}">${extra}<el-button link @click="open(row)">编辑</el-button><el-button link type="danger" @click="del(row.id)">删除</el-button></template></el-table-column></el-table></el-card><el-dialog v-model="show" title="${title}"><el-form :model="form" label-width="100px">${formFields}</el-form><template #footer><el-button @click="show=false">取消</el-button><el-button type="primary" @click="save">保存</el-button></template></el-dialog></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { ElMessage,ElMessageBox } from 'element-plus'; import { ${apiName} } from '../../api/modules'; import StatusTag from '../../components/StatusTag.vue'; const q=reactive({page:1,size:20}),list=ref([]),show=ref(false),form=reactive({}); async function load(){const d=await ${apiName}.list(q); list.value=d.records||d} function open(row){Object.keys(form).forEach(k=>delete form[k]); Object.assign(form,row); show.value=true} async function save(){form.id?await ${apiName}.update(form.id,form):await ${apiName}.add(form); ElMessage.success('保存成功'); show.value=false; load()} async function del(id){await ElMessageBox.confirm('确认删除？'); await ${apiName}.del(id); load()} onMounted(load)</script>
`);
}
adminCrudView('AdminSpots','景点管理',`<el-table-column prop="name" label="名称"/><el-table-column prop="location" label="地区"/><el-table-column prop="level" label="等级"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column>`, 'spotApi', `<el-form-item label="名称"><el-input v-model="form.name"/></el-form-item><el-form-item label="地区"><el-input v-model="form.location"/></el-form-item><el-form-item label="等级"><el-input v-model="form.level"/></el-form-item><el-form-item label="封面"><el-input v-model="form.coverImage"/></el-form-item><el-form-item label="状态"><el-select v-model="form.status"><el-option label="启用" value="ENABLE"/><el-option label="停用" value="DISABLE"/></el-select></el-form-item><el-form-item label="描述"><el-input type="textarea" v-model="form.description"/></el-form-item>`);
adminCrudView('Guides','导游管理',`<el-table-column prop="name" label="姓名"/><el-table-column prop="phone" label="手机"/><el-table-column prop="level" label="等级"/><el-table-column prop="status" label="状态"/>`, 'guideApi', `<el-form-item label="姓名"><el-input v-model="form.name"/></el-form-item><el-form-item label="手机"><el-input v-model="form.phone"/></el-form-item><el-form-item label="等级"><el-input v-model="form.level"/></el-form-item><el-form-item label="状态"><el-input v-model="form.status"/></el-form-item>`);
adminCrudView('AdminPackages','套餐管理',`<el-table-column prop="routeId" label="线路ID"/><el-table-column prop="packageName" label="套餐名"/><el-table-column prop="packageType" label="类型"/><el-table-column prop="price" label="价格"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column>`, 'packageApi', `<el-form-item label="线路ID"><el-input-number v-model="form.routeId"/></el-form-item><el-form-item label="套餐名"><el-input v-model="form.packageName"/></el-form-item><el-form-item label="类型"><el-input v-model="form.packageType"/></el-form-item><el-form-item label="价格"><el-input-number v-model="form.price"/></el-form-item><el-form-item label="包含服务"><el-input type="textarea" v-model="form.includeService"/></el-form-item><el-form-item label="不含服务"><el-input type="textarea" v-model="form.excludeService"/></el-form-item><el-form-item label="状态"><el-select v-model="form.status"><el-option label="启用" value="ENABLE"/><el-option label="停用" value="DISABLE"/></el-select></el-form-item>`);
adminCrudView('AdminRoutes','线路管理',`<el-table-column prop="routeName" label="线路"/><el-table-column prop="spotId" label="景点ID"/><el-table-column prop="days" label="天数"/><el-table-column prop="price" label="价格"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column>`, 'routeApi', `<el-form-item label="线路名"><el-input v-model="form.routeName"/></el-form-item><el-form-item label="景点ID"><el-input-number v-model="form.spotId"/></el-form-item><el-form-item label="天数"><el-input-number v-model="form.days"/></el-form-item><el-form-item label="价格"><el-input-number v-model="form.price"/></el-form-item><el-form-item label="人数上限"><el-input-number v-model="form.maxPeople"/></el-form-item><el-form-item label="封面"><el-input v-model="form.coverImage"/></el-form-item><el-form-item label="行程"><el-input type="textarea" v-model="form.itinerary"/></el-form-item><el-form-item label="描述"><el-input type="textarea" v-model="form.description"/></el-form-item><el-form-item label="状态"><el-select v-model="form.status"><el-option label="上架" value="ON_SALE"/><el-option label="下架" value="OFF_SALE"/></el-select></el-form-item>`, `<el-button link @click="routeApi.off(row.id).then(load)">下架</el-button><el-button link @click="routeApi.on(row.id).then(load)">上架</el-button>`);

w('tourism-frontend/src/views/admin/AdminOrders.vue', `
<template><div><el-card><div class="toolbar"><h2>订单核对</h2><el-select v-model="q.status" clearable placeholder="状态"><el-option v-for="s in statuses" :key="s" :label="s" :value="s"/></el-select><el-input v-model="q.phone" placeholder="游客手机号" style="width:180px"/><el-button type="primary" @click="load">查询</el-button></div><el-table :data="list"><el-table-column prop="orderNo" label="订单号"/><el-table-column prop="routeId" label="线路ID"/><el-table-column prop="travelDate" label="出行日期"/><el-table-column prop="peopleCount" label="人数"/><el-table-column prop="totalAmount" label="金额"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column><el-table-column label="操作" width="300"><template #default="{row}"><el-button link type="success" @click="confirm(row.id)">确认</el-button><el-button link type="warning" @click="ret(row.id)">退回</el-button><el-button link @click="adminOrderApi.start(row.id).then(load)">出行</el-button><el-button link @click="adminOrderApi.finish(row.id).then(load)">完成</el-button><el-button link @click="adminOrderApi.archive(row.id).then(load)">归档</el-button></template></el-table-column></el-table></el-card></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { ElMessage,ElMessageBox } from 'element-plus'; import { adminOrderApi } from '../../api/modules'; import StatusTag from '../../components/StatusTag.vue'; const statuses=['PENDING_CHECK','RETURNED','CONFIRMED','ARRANGED','TRAVELING','FINISHED','CANCELED','ARCHIVED']; const q=reactive({}),list=ref([]); async function load(){list.value=await adminOrderApi.list(q)} async function confirm(id){await adminOrderApi.confirm(id); ElMessage.success('已确认'); load()} async function ret(id){const {value}=await ElMessageBox.prompt('填写退回原因','退回订单'); await adminOrderApi.ret(id,value); load()} onMounted(load)</script>
`);
w('tourism-frontend/src/views/admin/Arrangements.vue', `
<template><div><el-card><h2>出行安排</h2><el-form :model="form" inline><el-form-item label="订单ID"><el-input-number v-model="form.orderId"/></el-form-item><el-form-item label="导游"><el-select v-model="form.guideId" style="width:160px"><el-option v-for="g in guides" :key="g.id" :label="g.name" :value="g.id"/></el-select></el-form-item><el-form-item label="批次"><el-input v-model="form.batchNo"/></el-form-item><el-form-item label="出发时间"><el-date-picker v-model="form.departTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss"/></el-form-item><el-form-item label="集合地点"><el-input v-model="form.gatherPlace"/></el-form-item><el-form-item label="提醒"><el-input v-model="form.reminder"/></el-form-item><el-button type="primary" @click="save">创建安排</el-button></el-form><el-divider/><p class="muted">提示：只有 CONFIRMED 状态订单可以创建安排，创建后订单变为 ARRANGED。</p></el-card></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { ElMessage } from 'element-plus'; import { guideApi,arrangementApi } from '../../api/modules'; const form=reactive({}),guides=ref([]); async function save(){await arrangementApi.add(form); ElMessage.success('安排成功')} onMounted(async()=>guides.value=await guideApi.list())</script>
`);
w('tourism-frontend/src/views/admin/AdminAfterSales.vue', `
<template><div><el-card><h2>售后管理</h2><el-table :data="list"><el-table-column prop="orderId" label="订单ID"/><el-table-column prop="userId" label="用户ID"/><el-table-column prop="type" label="类型"/><el-table-column prop="content" label="内容"/><el-table-column label="状态"><template #default="{row}"><StatusTag :value="row.status"/></template></el-table-column><el-table-column prop="reply" label="回复"/><el-table-column label="操作"><template #default="{row}"><el-button link @click="open(row)">回复</el-button></template></el-table-column></el-table></el-card><el-dialog v-model="show" title="售后回复"><el-form :model="form" label-width="80px"><el-form-item label="状态"><el-select v-model="form.status"><el-option label="处理中" value="PROCESSING"/><el-option label="已完成" value="DONE"/><el-option label="已拒绝" value="REJECTED"/></el-select></el-form-item><el-form-item label="回复"><el-input type="textarea" v-model="form.reply"/></el-form-item></el-form><template #footer><el-button @click="show=false">取消</el-button><el-button type="primary" @click="save">保存</el-button></template></el-dialog></div></template>
<script setup>import { reactive,ref,onMounted } from 'vue'; import { ElMessage } from 'element-plus'; import { afterSaleApi } from '../../api/modules'; import StatusTag from '../../components/StatusTag.vue'; const list=ref([]),show=ref(false),form=reactive({}); async function load(){list.value=await afterSaleApi.admin()} function open(row){Object.assign(form,row); show.value=true} async function save(){await afterSaleApi.reply(form.id,{status:form.status,reply:form.reply}); ElMessage.success('已回复'); show.value=false; load()} onMounted(load)</script>
`);
w('tourism-frontend/src/views/admin/Reports.vue', `
<template><div><el-card><h2>统计报表</h2><div class="toolbar"><el-date-picker v-model="q.startDate" value-format="YYYY-MM-DD" placeholder="开始日期"/><el-date-picker v-model="q.endDate" value-format="YYYY-MM-DD" placeholder="结束日期"/><el-select v-model="q.status" clearable placeholder="状态"><el-option v-for="s in statuses" :key="s" :label="s" :value="s"/></el-select><el-button type="primary" @click="load">统计</el-button><el-button @click="exportExcel">导出 Excel</el-button></div><div class="stat-row"><div class="stat-card"><div>订单数量</div><div class="stat-number">{{s.orderCount||0}}</div></div><div class="stat-card"><div>总人数</div><div class="stat-number">{{s.peopleCount||0}}</div></div><div class="stat-card"><div>总金额</div><div class="stat-number">￥{{s.totalAmount||0}}</div></div></div></el-card></div></template>
<script setup>import { reactive,onMounted } from 'vue'; import { adminOrderApi } from '../../api/modules'; const q=reactive({}),s=reactive({}); const statuses=['PENDING_CHECK','RETURNED','CONFIRMED','ARRANGED','TRAVELING','FINISHED','CANCELED','ARCHIVED']; async function load(){Object.assign(s, await adminOrderApi.stat(q))} function exportExcel(){const token=localStorage.getItem('token'); window.open(adminOrderApi.exportUrl({...q,token}))} onMounted(load)</script>
`);

w('start.ps1', `
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Logs = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $Logs | Out-Null

function Get-MavenCommand {
  $mvn = Get-Command mvn -ErrorAction SilentlyContinue
  if ($mvn) { return "mvn" }
  $tools = Join-Path $Root "tools"
  $mvnHome = Join-Path $tools "apache-maven-3.9.9"
  $mvnCmd = Join-Path $mvnHome "bin\\mvn.cmd"
  if (!(Test-Path $mvnCmd)) {
    New-Item -ItemType Directory -Force -Path $tools | Out-Null
    $zip = Join-Path $tools "maven.zip"
    Write-Host "未检测到 Maven，正在下载本地 Maven..."
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip" -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $tools -Force
  }
  return $mvnCmd
}

$mvnCmd = Get-MavenCommand
Write-Host "启动后端 http://localhost:8080"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$Root\\tourism-backend'; & '$mvnCmd' spring-boot:run *> '$Logs\\backend.log'" -WindowStyle Normal
Write-Host "安装并启动前端 http://localhost:5173"
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$Root\\tourism-frontend'; npm install; npm run dev *> '$Logs\\frontend.log'" -WindowStyle Normal
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
`);

w('README.md', `
# 旅游管理系统课程设计

项目包含：
- \`tourism-backend\`：Spring Boot 3 + MyBatis Plus + MySQL + JWT + POI
- \`tourism-frontend\`：Vue 3 + Vite + Element Plus + Axios + Pinia
- \`tourism-backend/src/main/resources/sql/init.sql\`：建表和演示数据
- \`start.ps1\`：一键启动脚本，会在没有 Maven 时下载本地 Maven

## 启动步骤

1. 启动 MySQL 8。
2. 执行 \`tourism-backend/src/main/resources/sql/init.sql\`。
3. 如 MySQL 密码不是 \`123456\`，修改 \`tourism-backend/src/main/resources/application.yml\`。
4. 在 PowerShell 中运行：

\`\`\`powershell
cd D:\\codex\\旅游管理系统-20260622
.\\start.ps1
\`\`\`

前端地址：http://localhost:5173
后端地址：http://localhost:8080

## 测试账号

- 管理员：admin / 123456
- 游客：tourist1 / 123456
- 游客：tourist2 / 123456

## 演示流程

管理员登录后台，新增景点、线路、套餐；游客登录维护常用出行人，浏览线路详情并提交订单；管理员在订单核对中确认订单，在出行安排页分配导游和批次；游客查看订单安排并提交售后；管理员回复售后；最后在统计报表页筛选并导出 Excel，完成后归档订单。
`);

console.log('project generated at ' + root);
