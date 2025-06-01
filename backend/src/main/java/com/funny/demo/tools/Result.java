package com.funny.demo.tools;

import lombok.Data;

@Data
public class Result {
    private Boolean flag;
    private Object result;
    private String msg;

    public Result() {
    }

    public Result(Boolean flag, Object data, String msg) {
        this.flag = flag;
        this.result = data;
        this.msg = msg;
    }

    public Result(Boolean flag, String msg) {
        this.flag = flag;
        this.msg = msg;
    }

    public Result(String msg) {
        this.flag=false;
        this.msg = msg;
    }

    public Result(Object data, String msg) {
        this.flag=true;
        this.result = data;
        this.msg = msg;
    }
}

