package com.funny.demo.tools;

import com.aliyun.oss.OSS;
import com.aliyun.oss.model.ObjectMetadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.UUID;
import java.io.FileInputStream;

@Component
@Slf4j
public class OSSUtil {
    @Autowired
    private OSS ossClient;

    @Value("${aliyun.oss.bucketName}")
    private String bucketName;

    @Value("${aliyun.oss.urlExpireTime}")
    private Long expireTime;

    @Value("${aliyun.oss.folder}")
    private String folder;


    public String uploadFile(MultipartFile file) {
        try {
            // 获取上传的文件的输入流
            InputStream inputStream = file.getInputStream();
            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));
            //上传文件到OSS
            ossClient.putObject(bucketName, fileName, inputStream);
            // 生成访问URL
            return generateUrl(fileName);
        } catch (IOException e) {
            log.error("文件上传失败：", e);
            throw new RuntimeException("文件上传失败");
        }
    }

    /**
     * 生成文件访问URL
     */
    private String generateUrl(String fileName) {
        Date expiration = new Date(System.currentTimeMillis() + expireTime * 1000);
        return ossClient.generatePresignedUrl(bucketName, fileName, expiration).toString();
    }
    /**
     * 上传MP3文件到OSS
     */
    public String uploadMp3(File mp3File) throws Exception {
        String objectName = folder + UUID.randomUUID().toString() + ".mp3";

        try (InputStream inputStream = new FileInputStream(mp3File)) {
            // 设置元数据
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("audio/mpeg");
            metadata.setContentLength(mp3File.length());

            // 上传文件
            ossClient.putObject(bucketName, objectName, inputStream, metadata);

            String url = generateUrl(objectName);
            return url;
        }
    }
}
