package com.health.my.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EffectController {

    private static final String API_KEY = "f82yPXMXNwVt%2Bs0bhbI6wzLIZDCJ%2FE5qXCVZc6YCiU2r%2F9c9mT8aX5v6E9wTaNqWIRKusEqdAmc2KOp23FetzA%3D%3D";
    private static final String BASE_URL = "https://apis.data.go.kr/1390802/AgriFood/FncltyEfcy2/getThesisInfoOnFoodByFnclty2";

    @GetMapping("/api/food-samples")
    public Map<String, Object> getFoodSamples(
            @RequestParam("fnclty_Cd") String fncltyCode,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Map<String, Object> response = new HashMap<>();
        List<String> sampleNames = new ArrayList<>();

        try {
            // API 요청 URL 구성
            String apiUrl = BASE_URL +
                    "?serviceKey=" + API_KEY +
                    "&fnclty_Cd=" + fncltyCode +
                    "&research_Type_Cd=G005" +
                    "&Page_No=" + page +
                    "&Page_Size=" + size;

            // RestTemplate을 사용하여 API 호출
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/xml");
            RestTemplate restTemplate = new RestTemplate();
            String xmlResponse = restTemplate.getForObject(apiUrl, String.class);
            
            ResponseEntity<String> response1= restTemplate.getForEntity(apiUrl, String.class);
            		
            		
            System.out.println("Status code: " + response1.getStatusCode());
            System.out.println("Body: " + response1.getBody());
            HttpEntity<String> entity = new HttpEntity<>(headers);
            // XML 파싱
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            
        
            Document doc = builder.parse(new ByteArrayInputStream(xmlResponse.getBytes(StandardCharsets.UTF_8)));

            // 결과 코드 확인
            NodeList resultCodeList = doc.getElementsByTagName("result_Code");
            if (resultCodeList.getLength() > 0) {
                String resultCode = resultCodeList.item(0).getTextContent();
                if (!resultCode.equals("200")) {
                    throw new Exception("API 응답 오류. 결과 코드: " + resultCode);
                }
            }

            // 총 아이템 수 추출
            NodeList totalCountList = doc.getElementsByTagName("total_Count");
            int totalCount = 0;
            if (totalCountList.getLength() > 0) {
                totalCount = Integer.parseInt(totalCountList.item(0).getTextContent());
            }

            // items -> sample_List 내부의 item 태그 검색
            NodeList itemsList = doc.getElementsByTagName("items");
            if (itemsList.getLength() > 0) {
                Element items = (Element) itemsList.item(0);
                NodeList sampleLists = items.getElementsByTagName("sample_List");
                if (sampleLists.getLength() > 0) {
                    Element sampleList = (Element) sampleLists.item(0);
                    NodeList sampleItems = sampleList.getElementsByTagName("item");

                    // 각 샘플 아이템에서 sample_Nm 추출
                    for (int i = 0; i < sampleItems.getLength(); i++) {
                        Element item = (Element) sampleItems.item(i);
                        NodeList sampleNmList = item.getElementsByTagName("sample_Nm");

                        if (sampleNmList.getLength() > 0) {
                            String sampleName = sampleNmList.item(0).getTextContent().trim();
                            if (!sampleNames.contains(sampleName)) { // 중복 제거
                                sampleNames.add(sampleName);
                            }
                        }
                    }
                }
            }

            // 응답 구성
            response.put("success", true);
            response.put("totalCount", totalCount);
            response.put("samples", sampleNames);
            response.put("page", page);
            response.put("size", size);
            response.put("totalPages", (int) Math.ceil((double) totalCount / size));

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            e.printStackTrace(); // 서버 로그에 에러 기록
        }

        return response;
    }
}