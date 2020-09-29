package org.camunda.bpm.extension.hooks.delegates;

import com.fasterxml.jackson.databind.JsonNode;
import com.nimbusds.oauth2.sdk.util.CollectionUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.extension.commons.connector.HTTPServiceInvoker;
import org.camunda.bpm.extension.hooks.services.FormSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;
import  com.fasterxml.jackson.core.JsonProcessingException;


import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 *
 * @author sumathi.thirumani@aot-technologies.com
 */
@Component
public class FormTextAnalysisDelegate implements JavaDelegate {

    private final Logger LOGGER = Logger.getLogger(FormTextAnalysisDelegate.class.getName());

    @Autowired
    private FormSubmissionService formSubmissionService;

    @Autowired
    private HTTPServiceInvoker httpServiceInvoker;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        List<TextSentimentRequest> textSentimentRequests = prepareRequest(execution);
        if(CollectionUtils.isNotEmpty(textSentimentRequests)) {
            httpServiceInvoker.execute(getUrl(), HttpMethod.POST,textSentimentRequests.get(0));
        }
    }

    private List<TextSentimentRequest> prepareRequest(DelegateExecution execution) throws JsonProcessingException {
        List<TextSentimentRequest> reqEntries = new ArrayList();
            String submission = formSubmissionService.readSubmission(String.valueOf(execution.getVariables().get("formUrl")));
            if(submission.isEmpty()) {
                throw new RuntimeException("Unable to retrieve submission");
            }
            JsonNode dataNode = getObjectMapper().readTree(submission);
            Iterator<Map.Entry<String, JsonNode>> dataElements = dataNode.findPath("data").fields();
            while (dataElements.hasNext()) {
                Map.Entry<String, JsonNode> entry = dataElements.next();
                if(entry.getValue().has("type") && getSentimentCategory().equals(entry.getValue().get("type").asText())) {
                    reqEntries.add(CreateTextSentimentRequest(((Integer) execution.getVariable("applicationId")).intValue(),
                            String.valueOf(execution.getVariable("formUrl")), entry.getKey(),
                            getObjectMapper().readValue(entry.getValue().get("topics").toString(), List.class), entry.getValue().get("text").asText()));
                }
        }

        return reqEntries;
    }

    private ObjectMapper getObjectMapper(){
        return new ObjectMapper();
    }

    public TextSentimentRequest CreateTextSentimentRequest(Integer applicationId, String formUrl, String elementId, List<String> topics, String text) {
        return new TextSentimentRequest(applicationId, formUrl, elementId, topics, text);
    }

    private String getUrl(){
        return httpServiceInvoker.getProperties().getProperty("api.url")+"/sentiment";
    }

    private String getSentimentCategory() {
        return "textAreaWithAnalytics";
    }

}

@Scope("prototype")
@Data
@NoArgsConstructor
@AllArgsConstructor
class TextSentimentRequest{
    private Integer applicationId;
    private String formUrl;
    private String elementId;
    private List<String> topics;
    private String text;
}

